<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Filiere;
use Illuminate\Http\Request;

class FiliereController extends Controller
{
    public function index()
    {
        return response()->json(
            Filiere::orderBy('nom')->get()
        );
    }

    public function show(Filiere $filiere)
    {
        return response()->json($filiere);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:20', 'unique:filieres,code'],
            'description' => ['nullable', 'string'],
            'niveau' => ['required', 'string', 'max:50'],
            'frais_scolarite_total' => ['required', 'numeric', 'min:0'],
            'nombre_tranches' => ['required', 'integer', 'min:1', 'max:12'],
            'nombre_places' => ['nullable', 'integer', 'min:1'],
        ]);

        $filiere = Filiere::create([
            ...$validated,
            'statut' => 'active',
            'created_by' => $request->user()->id,
        ]);

        return response()->json($filiere, 201);
    }

    public function update(Request $request, Filiere $filiere)
    {
        $validated = $request->validate([
            'nom' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:20', 'unique:filieres,code,'.$filiere->id],
            'description' => ['nullable', 'string'],
            'niveau' => ['required', 'string', 'max:50'],
            'frais_scolarite_total' => ['required', 'numeric', 'min:0'],
            'nombre_tranches' => ['required', 'integer', 'min:1', 'max:12'],
            'nombre_places' => ['nullable', 'integer', 'min:1'],
        ]);

        $filiere->update($validated);

        return response()->json($filiere);
    }

    public function updateStatut(Request $request, Filiere $filiere)
    {
        $validated = $request->validate([
            'statut' => ['required', 'in:active,archivee'],
        ]);

        $filiere->update($validated);

        return response()->json($filiere);
    }

    public function destroy(Filiere $filiere)
    {
        $filiere->delete();

        return response()->json(null, 204);
    }
}
