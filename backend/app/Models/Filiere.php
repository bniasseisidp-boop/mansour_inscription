<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Filiere extends Model
{
    protected $fillable = [
        'nom',
        'code',
        'description',
        'niveau',
        'frais_scolarite_total',
        'nombre_tranches',
        'nombre_places',
        'statut',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'frais_scolarite_total' => 'decimal:2',
            'nombre_tranches' => 'integer',
            'nombre_places' => 'integer',
        ];
    }
}
