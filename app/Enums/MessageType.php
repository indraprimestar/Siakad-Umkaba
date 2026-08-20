<?php



namespace App\Enums;

enum MessageType: string {
    case CREATED = "Data Berhasil Ditambahkan";

    case UPDATED = "Data Berhasil Diubah";

    case DELETED = "Data Berhasil Dihapus";

    case ERROR = "Terjadi Kesalahan. Silahkan Coba Lagi";

    public function message(string $entity = '', ?string $error = null): string
    {
        if ($this == MessageType::ERROR && $error) {
            return "{$this->value} {$error}";
        }

        return "{$this->value} {$entity}";
        }
    }
