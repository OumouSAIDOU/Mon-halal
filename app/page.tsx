import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navbar intégrée */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-gray-100 py-20 lg:py-32">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-900 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            🇫🇷 La plateforme de rencontre éthique pour les musulmans de France
          </span>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
            Rencontrez votre moitié dans le <span className="text-blue-900">respect</span> et la <span className="text-red-600">sincérité</span>.
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Mon HALAL est pensé pour vous offrir des échanges sérieux, basés sur des valeurs communes et une vision partagée de l’avenir.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-blue-900 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition"
            >
              Créer mon compte gratuitement
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-4 rounded-xl font-bold text-base transition"
            >
              Me connecter
            </Link>
          </div>
        </div>
      </section>

      {/* Section : Nos Valeurs */}
      <section id="valeurs" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Mon HALAL ?
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Un cadre sain et sécurisé pensé spécifiquement pour répondre à vos attentes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-xl flex items-center justify-center text-2xl font-bold mb-6">
                🤝
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Engagements sérieux</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Chaque membre s’inscrit dans une démarche sincère visant le mariage et l’établissement d’un foyer stable.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center text-2xl font-bold mb-6">
                🛡️
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Respect & Confidentialité</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Vos données restent privées et protégées. Échangez en toute sérénité dans un environnement bienveillant.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-xl flex items-center justify-center text-2xl font-bold mb-6">
                🇫🇷
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Proximité Locale</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Trouvez des personnes qui partagent votre quotidien et votre culture partout en France.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section : Comment ça marche */}
      <section id="etape" className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-gray-600">3 étapes simples pour débuter votre recherche</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-10 h-10 bg-blue-900 text-white font-bold rounded-full flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h4 className="font-bold text-lg text-gray-900 mb-2">Inscrivez-vous</h4>
              <p className="text-gray-600 text-sm">Créez votre compte et remplissez votre profil avec soin.</p>
            </div>

            <div className="p-6">
              <div className="w-10 h-10 bg-blue-900 text-white font-bold rounded-full flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h4 className="font-bold text-lg text-gray-900 mb-2">Découvrez des profils</h4>
              <p className="text-gray-600 text-sm">Parcourez les membres compatibles selon vos critères.</p>
            </div>

            <div className="p-6">
              <div className="w-10 h-10 bg-blue-900 text-white font-bold rounded-full flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h4 className="font-bold text-lg text-gray-900 mb-2">Échangez</h4>
              <p className="text-gray-600 text-sm">Likelikez les profils qui vous inspirent et commencez à discuter.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xl font-bold text-white">
            Mon <span className="text-red-500">HALAL</span> 🇫🇷
          </div>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Mon HALAL. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}