<?php

class NonceService {

    private function generateRandomString($length = 10) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[random_int(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    public function generateNonce() {

        $nonce = hash('sha512', microtime(true) . $this->generateRandomString());
        file_put_contents('nonce_store.txt', "$nonce\n", FILE_APPEND | LOCK_EX);
        return $nonce;

    }

    public function validateNonce($nonce) {

        $nonceData = file_get_contents('nonce_store.txt');
        if(!str_contains($nonceData, $nonce)){
            return false;
        }

        file_put_contents('nonce_store.txt', str_replace("$nonce\n", '', $nonceData));
        return true;

    }

}