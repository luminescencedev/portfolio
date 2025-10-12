import Image from "next/image";

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Image de fond ancrée sur la gauche */}
      <div className="absolute inset-0 bg-white">
        <Image
          src="/onev1.png"
          alt="Background"
          fill
          className="object-cover object-left scale-110"
          priority
        />
      </div>

      {/* Contenu de votre page (optionnel) */}
      <div className="relative z-10 h-screen">
        {/* Vous pouvez ajouter du contenu ici par-dessus l'image */}
      </div>
    </div>
  );
}
