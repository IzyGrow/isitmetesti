import React from "react";

const Footer = () => (
  <footer className="bg-gray-100 border-t mt-12">
    <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row md:justify-between gap-8">
      <div className="flex flex-col items-start gap-4 md:w-1/3">
        <img
          src="/izmirses-logo.jpeg"
          alt="İzmir Ses Logo"
          className="w-32 h-auto mb-2"
        />
        <p className="text-gray-700 text-sm max-w-xs">
          İzmir Ses, İzmir’de işitme kaybıyla mücadele eden bireylere en iyi işitme çözümlerini sunmaya kendini adamıştır. 20 yılı aşkın deneyime sahip uzman ekibimiz, her bireyin özel ihtiyaçlarını karşılamak için en son teknolojiyi ve en yüksek kaliteli ürünleri kullanmaktadır.
        </p>
      </div>
      <div className="flex flex-col gap-2 md:w-1/3">
        <h3 className="font-semibold mb-2">Hızlı Erişim</h3>
        <ul className="text-gray-700 text-sm space-y-1">
          <li><a href="/" className="hover:underline">Anasayfa</a></li>
          <li><a href="#" className="hover:underline">Faydalı Bilgiler</a></li>
          <li><a href="#" className="hover:underline">Hakkımızda</a></li>
          <li><a href="#" className="hover:underline">Hizmetlerimiz</a></li>
          <li><a href="#" className="hover:underline">Kulak Arkası İşitme Cihazları</a></li>
          <li><a href="#" className="hover:underline">Kulak İçi İşitme Cihazları</a></li>
          <li><a href="#" className="hover:underline">Randevu Alın</a></li>
          <li><a href="#" className="hover:underline">İletişim</a></li>
        </ul>
      </div>
      <div className="flex flex-col gap-2 md:w-1/3">
        <h3 className="font-semibold mb-2">İletişim</h3>
        <p className="text-gray-700 text-sm">
          Şair eşref Bulv. No:82/1 Şair Apt. K:1 D:1 Alsancak / İzmir
        </p>
        <p className="text-gray-700 text-sm">
          <a href="mailto:info@izmirses.com" className="hover:underline">info@izmirses.com</a>
        </p>
        <p className="text-gray-700 text-sm">
          <a href="tel:05050359990" className="hover:underline">0 (505) 035 99 90</a>
        </p>
        <div className="mt-2">
          <span className="block text-xs text-gray-500 font-semibold mb-1">Şubelerimiz</span>
          <ul className="text-gray-700 text-xs space-y-0.5">
            <li>Karşıyaka Şube</li>
            <li>Gaziemir Şubesi</li>
            <li>Balçova Şubesi</li>
            <li>Menderes Şubesi</li>
            <li>Alsancak Şubesi</li>
            <li>Yeşilyurt Şubesi</li>
          </ul>
        </div>
      </div>
    </div>
    <div className="bg-gray-200 text-center py-3 text-xs text-gray-600">
      © 2025. İzmir Ses İşitme Cihazları. Tüm hakları saklıdır.
    </div>
  </footer>
);

export default Footer; 