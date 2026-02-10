<?php
// Minimal JWT helper (HS256) — reads secret from env or uses dev fallback
function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function create_jwt($payload, $expiry = 604800) { // default 7 days
    $header = ['alg' => 'HS256', 'typ' => 'JWT'];
    $now = time();
    $payload = array_merge($payload, ['iat' => $now, 'exp' => $now + $expiry]);

    $header_b64 = base64url_encode(json_encode($header));
    $payload_b64 = base64url_encode(json_encode($payload));

    $unsigned = $header_b64 . '.' . $payload_b64;

    $secret = getenv('JWT_SECRET') ?: (isset($_ENV['JWT_SECRET']) ? $_ENV['JWT_SECRET'] : 'dev_secret_change_me');
    $signature = hash_hmac('sha256', $unsigned, $secret, true);
    $signature_b64 = base64url_encode($signature);

    return $unsigned . '.' . $signature_b64;
}

function verify_jwt($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return false;
    list($header_b64, $payload_b64, $sig_b64) = $parts;

    $unsigned = $header_b64 . '.' . $payload_b64;
    $secret = getenv('JWT_SECRET') ?: (isset($_ENV['JWT_SECRET']) ? $_ENV['JWT_SECRET'] : 'dev_secret_change_me');

    $expected_sig = base64url_encode(hash_hmac('sha256', $unsigned, $secret, true));
    if (!hash_equals($expected_sig, $sig_b64)) return false;

    $payload = json_decode(base64_decode(strtr($payload_b64, '-_', '+/')), true);
    if (!$payload) return false;
    if (isset($payload['exp']) && time() > $payload['exp']) return false;

    return $payload;
}

?>
