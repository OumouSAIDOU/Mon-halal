import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const userId = data.get('userId') as string;

    if (!file || !userId) {
      return NextResponse.json({ success: false, error: 'Fichier ou utilisateur manquant' }, { status: 400 });
    }

    // 1. Récupérer l'abonnement, la limite maxPhotos et les photos actuelles de l'utilisateur
    const [users]: any = await db.query(
      'SELECT u.subscription, u.maxPhotos, p.photos FROM users u LEFT JOIN profiles p ON u.id = p.user_id WHERE u.id = ?',
      [userId]
    );

    if (!users || users.length === 0) {
      return NextResponse.json({ success: false, error: 'Utilisateur introuvable' }, { status: 404 });
    }

    const { subscription, maxPhotos, photos } = users[0];

    // 2. Compter le nombre de photos déjà enregistrées
    const currentPhotosList = photos
      ? photos.split(',').filter((url: string) => url.trim() !== '')
      : [];

    // 3. Vérifier si l'utilisateur a atteint sa limite
    const limit = maxPhotos || 3; // Par défaut 3 pour Gratuit si non défini
    if (currentPhotosList.length >= limit) {
      return NextResponse.json(
        {
          success: false,
          error: `Votre formule (${subscription || 'Gratuit'}) est limitée à ${limit} photo(s). Passez à l'offre supérieure pour en ajouter d'autres.`,
        },
        { status: 403 }
      );
    }

    // 4. Enregistrement physique du fichier
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads', filename);

    await writeFile(uploadDir, buffer);

    // 5. Retourner l'URL publique de la photo
    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
    });

  } catch (error) {
    console.error('Erreur lors de l’upload :', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur lors de l’upload.' }, { status: 500 });
  }
}