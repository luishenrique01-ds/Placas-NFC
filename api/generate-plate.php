<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok'=>false,'error'=>'Use POST.']);
    exit;
}

if (!extension_loaded('gd') || !extension_loaded('imagick')) {
    http_response_code(500);
    echo json_encode(['ok'=>false,'error'=>'Este endpoint precisa das extensões PHP GD e Imagick.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['ok'=>false,'error'=>'JSON inválido.']);
    exit;
}

function dataUrlToBytes(?string $dataUrl): ?string {
    if (!$dataUrl) return null;
    if (!preg_match('/^data:[^;]+;base64,(.+)$/s', $dataUrl, $m)) return null;
    return base64_decode($m[1], true) ?: null;
}

function addCenteredText($image, string $text, int $y, int $size, int $width, array $rgb): void {
    $fonts = [
        __DIR__.'/fonts/DejaVuSans-Bold.ttf',
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
        '/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf'
    ];
    $font = null;
    foreach ($fonts as $candidate) if (is_file($candidate)) { $font=$candidate; break; }

    $color=imagecolorallocate($image,$rgb[0],$rgb[1],$rgb[2]);
    if ($font) {
        $box=imagettfbbox($size,0,$font,$text);
        $tw=abs($box[2]-$box[0]);
        imagettftext($image,$size,0,(int)(($width-$tw)/2),$y,$color,$font,$text);
    } else {
        $fontId=$size>=50?5:($size>=30?4:3);
        $tw=imagefontwidth($fontId)*strlen($text);
        imagestring($image,$fontId,(int)(($width-$tw)/2),$y-imagefontheight($fontId),$text,$color);
    }
}

function fitImage($dst,$src,int $x,int $y,int $maxW,int $maxH): void {
    $sw=imagesx($src); $sh=imagesy($src);
    $scale=min($maxW/$sw,$maxH/$sh);
    $w=max(1,(int)round($sw*$scale)); $h=max(1,(int)round($sh*$scale));
    imagecopyresampled($dst,$src,$x+(int)(($maxW-$w)/2),$y+(int)(($maxH-$h)/2),0,0,$w,$h,$sw,$sh);
}

$name=mb_strtoupper(trim((string)($input['name'] ?? 'SUA EMPRESA')),'UTF-8');
$name=mb_substr($name,0,28,'UTF-8');
$background=(string)($input['background'] ?? '#111827');
$logoBytes=dataUrlToBytes($input['logoDataUrl'] ?? null);
$qrBytes=dataUrlToBytes($input['qrDataUrl'] ?? null);

$scenePath=realpath(__DIR__.'/../src/gen_ai_image_838d6515-7fe8-4ed1-a5c3-96a32f1b73a5.jpeg');
if (!$scenePath || !is_file($scenePath)) {
    http_response_code(500);
    echo json_encode(['ok'=>false,'error'=>'Foto da cena não encontrada no servidor PHP.']);
    exit;
}

$scene=new Imagick($scenePath);
$scene->setImageColorspace(Imagick::COLORSPACE_SRGB);

$artW=1000; $artH=1375;
$art=imagecreatetruecolor($artW,$artH);
$hex=ltrim($background,'#');
if ($background==='transparent') $hex='f8f7f2';
if (strlen($hex)!==6) $hex='111827';
$bg=imagecolorallocate($art,hexdec(substr($hex,0,2)),hexdec(substr($hex,2,2)),hexdec(substr($hex,4,2)));
imagefill($art,0,0,$bg);

$fg=($background==='#f8f7f2'||$background==='transparent')?[17,24,39]:[255,255,255];
$yellow=[255,197,27];
$red=imagecolorallocate($art,239,51,64);

if ($logoBytes) {
    $logo=@imagecreatefromstring($logoBytes);
    if ($logo) fitImage($art,$logo,50,55,170,105);
}

addCenteredText($art,$name,205,36,$artW,$fg);
addCenteredText($art,'SUA AVALIAÇÃO',350,72,$artW,$fg);
addCenteredText($art,'É MUITO IMPORTANTE!',435,72,$artW,$background==='transparent'?[220,38,38]:$yellow);
imagefilledrectangle($art,255,478,745,490,$red);
addCenteredText($art,'Aponte seu celular',555,32,$artW,$fg);
addCenteredText($art,'ou escaneie o QR Code',595,32,$artW,$fg);

if ($qrBytes) {
    $qr=@imagecreatefromstring($qrBytes);
    if ($qr) fitImage($art,$qr,650,675,255,255);
}

addCenteredText($art,'★★★★★',1015,70,$artW,$background==='transparent'?[220,38,38]:$yellow);
addCenteredText($art,'Sua opinião faz toda a diferença!',1080,34,$artW,$fg);

ob_start(); imagejpeg($art,null,94); $artBytes=ob_get_clean(); imagedestroy($art);

$plate=new Imagick();
$plate->readImageBlob($artBytes);
$plate->setImageFormat('png');

$points=$input['points'] ?? [[0.390,0.305],[0.675,0.292],[0.705,0.575],[0.425,0.610]];
if (!is_array($points)||count($points)!==4) $points=[[0.390,0.305],[0.675,0.292],[0.705,0.575],[0.425,0.610]];

$sceneW=$scene->getImageWidth(); $sceneH=$scene->getImageHeight();
$dst=[];
foreach($points as $p){ $dst[]=(float)$p[0]*$sceneW; $dst[]=(float)$p[1]*$sceneH; }

try {
    $plate->distortImage(
        Imagick::DISTORTION_PERSPECTIVE,
        array_merge([0,0,$artW,0,$artW,$artH,0,$artH],$dst),
        true
    );
} catch(Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok'=>false,'error'=>'Falha na perspectiva: '.$e->getMessage()]);
    exit;
}

$page=$plate->getImagePage();
$resultImage=clone $scene;
$resultImage->compositeImage($plate,Imagick::COMPOSITE_OVER,(int)$page['x'],(int)$page['y']);
$resultImage->setImageFormat('jpeg');
$resultImage->setImageCompressionQuality(92);

echo json_encode([
    'ok'=>true,
    'mime'=>'image/jpeg',
    'image'=>'data:image/jpeg;base64,'.base64_encode($resultImage->getImagesBlob())
]);
