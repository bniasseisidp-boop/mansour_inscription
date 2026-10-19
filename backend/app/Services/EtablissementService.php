<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Identité de l'établissement (nom, logo, contact, direction) — source unique
 * utilisée par les documents PDF (PDFService) et les emails transactionnels
 * (Mailables). Lue depuis site_settings (gérée par le super admin via
 * ContentController::getEtablissementSettings), avec les valeurs ISI SUPTECH
 * actuelles comme défaut tant que rien n'a été personnalisé.
 */
class EtablissementService
{
    public static function identite(): array
    {
        $s = DB::table('site_settings')
            ->whereIn('cle', [
                'etablissement_nom', 'etablissement_nom_complet', 'etablissement_slogan',
                'etablissement_telephone', 'etablissement_email', 'etablissement_site_web',
                'etablissement_ville', 'etablissement_logo', 'etablissement_directeur',
            ])
            ->pluck('valeur', 'cle');

        $logoRel = $s['etablissement_logo'] ?? null;
        $logoAbs = ($logoRel && Storage::disk('public')->exists($logoRel))
            ? Storage::disk('public')->path($logoRel)
            : public_path('isi-logo.png');

        return [
            'nom'         => $s['etablissement_nom'] ?? 'ISI SUPTECH',
            'nom_complet' => $s['etablissement_nom_complet'] ?? "Institut Supérieur d'Informatique",
            'slogan'      => $s['etablissement_slogan'] ?? "Un institut tourné vers les métiers d'avenir",
            'telephone'   => $s['etablissement_telephone'] ?? '77 978 26 18',
            'email'       => $s['etablissement_email'] ?? 'contact@isisuptech.com',
            'site_web'    => $s['etablissement_site_web'] ?? 'www.isisuptech.com',
            'ville'       => $s['etablissement_ville'] ?? 'Dakar',
            'directeur'   => $s['etablissement_directeur'] ?? 'Serigne M. Kara SAMB',
            'logo'        => $logoAbs,
        ];
    }
}
