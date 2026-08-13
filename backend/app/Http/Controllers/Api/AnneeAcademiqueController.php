<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AnneeAcademique;
use Illuminate\Http\Request;

class AnneeAcademiqueController extends Controller
{
    public function index()
    {
        return response()->json(
            AnneeAcademique::orderByDesc('date_debut')->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'libelle' => ['required', 'string', 'max:20', 'unique:annees_academiques,libelle'],
            'date_debut' => ['required', 'date'],
            'date_fin' => ['required', 'date', 'after:date_debut'],
        ]);

        $annee = AnneeAcademique::create([
            ...$validated,
            'statut' => 'active',
            'created_by' => $request->user()->id,
        ]);

        return response()->json($annee, 201);
    }

    public function updateStatut(Request $request, AnneeAcademique $anneeAcademique)
    {
        $validated = $request->validate([
            'statut' => ['required', 'in:active,cloturee'],
        ]);

        $anneeAcademique->update($validated);

        return response()->json($anneeAcademique);
    }

    public function destroy(AnneeAcademique $anneeAcademique)
    {
        $anneeAcademique->delete();

        return response()->json(null, 204);
    }
}
