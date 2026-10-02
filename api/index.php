<?php
declare(strict_types=1);

/**
 * Entrada da API PHP do projeto Placas NFC.
 *
 * GET  /api/                 -> verifica se o PHP está funcionando.
 * POST /api/generate-plate.php -> renderiza a placa personalizada.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $gd = extension_loaded('gd');
    $imagick = extension_loaded('imagick');

    echo json_encode([
        'ok' => true,
        'service' => 'Placas NFC PHP API',
        'status' => ($gd && $imagick) ? 'ready' : 'missing_extensions',
        'php_version' => PHP_VERSION,
        'extensions' => [
            'gd' => $gd,
            'imagick' => $imagick,
        ],
        'renderer' => 'generate-plate.php',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $renderer = __DIR__ . '/generate-plate.php';

    if (!is_file($renderer)) {
        http_response_code(500);
        echo json_encode([
            'ok' => false,
            'error' => 'Renderizador PHP não encontrado: generate-plate.php',
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    require $renderer;
    exit;
}

http_response_code(405);
header('Allow: GET, POST, OPTIONS');

echo json_encode([
    'ok' => false,
    'error' => 'Método não permitido. Use GET ou POST.',
], JSON_UNESCAPED_UNICODE);
