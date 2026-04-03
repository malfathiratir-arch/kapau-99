const Menu = require('../models/Menu');

// Keyword-based AI chat (no OpenAI needed)
const chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Pesan tidak boleh kosong' });

    const msg = message.toLowerCase();
    let reply = '';

    // Get menu data for dynamic responses
    const menus = await Menu.find({ isAvailable: true });
    const makanan = menus.filter(m => m.category === 'makanan');
    const minuman = menus.filter(m => m.category === 'minuman');
    const nasi = menus.filter(m => m.category === 'nasi');

    const formatMenu = (items) => items.map(m => `• ${m.name} - Rp ${m.price.toLocaleString('id-ID')}`).join('\n');

    // Greeting
    if (msg.match(/halo|hai|hello|hi|selamat|pagi|siang|sore|malam/)) {
      const greetings = [
        'Halo! 👋 Selamat datang di Rumah Makan Kapau 99! Saya siap membantu Anda menemukan menu yang pas. Mau pesan apa hari ini?',
        'Hai! 😊 Selamat datang! Ada yang bisa saya bantu? Mau lihat menu atau butuh rekomendasi?',
        'Selamat datang di Kapau 99! 🍛 Ada yang bisa saya bantu?',
      ];
      reply = greetings[Math.floor(Math.random() * greetings.length)];
    }

    // Menu list
    else if (msg.match(/menu|daftar|lihat|semua|apa saja|ada apa/)) {
      reply = `📋 *Menu Rumah Makan Kapau 99*\n\n🍛 *Makanan:*\n${formatMenu(makanan)}\n\n🍚 *Nasi:*\n${formatMenu(nasi)}\n\n🥤 *Minuman:*\n${formatMenu(minuman)}\n\nSilakan klik menu yang Anda inginkan untuk memesan! 😊`;
    }

    // Makanan only
    else if (msg.match(/makanan|lauk|rendang|ayam|gulai|sate|dendeng|ikan/)) {
      reply = `🍛 *Menu Makanan Kami:*\n\n${formatMenu(makanan)}\n\nSemua menu dibuat dengan bumbu rempah autentik khas Minang! 😋`;
    }

    // Minuman only
    else if (msg.match(/minum|minuman|es|jus|air|teh|jeruk/)) {
      reply = `🥤 *Menu Minuman Kami:*\n\n${formatMenu(minuman)}\n\nSegar dan nikmat menemani makan Anda! 😊`;
    }

    // Nasi only
    else if (msg.match(/nasi|rice/)) {
      reply = `🍚 *Menu Nasi Kami:*\n\n${formatMenu(nasi)}\n\nNasi pulen hangat siap disajikan! 😊`;
    }

    // Price query
    else if (msg.match(/harga|berapa|murah|mahal/)) {
      const murah = [...menus].sort((a, b) => a.price - b.price).slice(0, 3);
      reply = `💰 *Info Harga:*\n\n*Menu paling terjangkau:*\n${formatMenu(murah)}\n\nHarga kami mulai dari Rp 5.000! Kualitas terjamin dengan harga bersahabat 🙏`;
    }

    // Recommendation
    else if (msg.match(/rekomendasi|recommend|enak|favorit|terbaik|populer|suka/)) {
      const recs = [
        menus.find(m => m.name.toLowerCase().includes('rendang')),
        menus.find(m => m.name.toLowerCase().includes('ayam pop')),
        menus.find(m => m.name.toLowerCase().includes('sate')),
      ].filter(Boolean);
      reply = `⭐ *Rekomendasi Terbaik Kami:*\n\n${formatMenu(recs)}\n\nMenu-menu ini adalah favorit pelanggan setia kami! Dijamin enak dan bikin ketagihan 😋`;
    }

    // Rendang specific
    else if (msg.match(/rendang/)) {
      const rendang = menus.find(m => m.name.toLowerCase().includes('rendang'));
      if (rendang) {
        reply = `🥩 *${rendang.name}*\n\nHarga: Rp ${rendang.price.toLocaleString('id-ID')}\n\n${rendang.description}\n\nRendang kami dimasak dengan bumbu rempah pilihan selama berjam-jam untuk menghasilkan cita rasa terbaik! 🔥`;
      }
    }

    // Order info
    else if (msg.match(/pesan|order|beli|cara|bagaimana|gimana/)) {
      reply = `🛒 *Cara Memesan:*\n\n1️⃣ Browse menu di halaman Menu\n2️⃣ Klik menu yang diinginkan\n3️⃣ Atur jumlah & tambahkan catatan\n4️⃣ Klik "Tambah ke Keranjang"\n5️⃣ Buka keranjang & checkout\n6️⃣ Isi data pengiriman\n7️⃣ Pilih metode pembayaran\n8️⃣ Konfirmasi pesanan\n\nMudah dan cepat! 🚀`;
    }

    // Payment
    else if (msg.match(/bayar|payment|cod|transfer|ewallet|gopay|ovo|dana/)) {
      reply = `💳 *Metode Pembayaran:*\n\n💵 *COD (Cash on Delivery)* - Bayar saat pesanan tiba\n🏦 *Transfer Bank* - BCA, Mandiri, BNI, BRI\n📱 *E-Wallet* - GoPay, OVO, DANA, LinkAja\n\nSemua metode pembayaran aman dan terpercaya! 🔒`;
    }

    // Delivery / location
    else if (msg.match(/antar|kirim|delivery|lokasi|alamat|jam|buka/)) {
      reply = `📍 *Info Pengiriman & Operasional:*\n\n⏰ Jam Buka: 08.00 - 21.00 WIB\n🚗 Area Pengiriman: Cikarang & sekitarnya\n⏱️ Estimasi: 30-60 menit\n📞 Kontak: 0812-3456-7890\n\nPesanan diantarkan langsung ke lokasi Anda! 🏠`;
    }

    // Thank you
    else if (msg.match(/terima kasih|makasih|thanks|thank you/)) {
      reply = 'Sama-sama! 😊 Senang bisa membantu. Selamat menikmati makanan Kapau 99! Jangan lupa order lagi ya! 🍛';
    }

    // Default
    else {
      const suggestions = ['menu', 'rekomendasi', 'harga', 'cara pesan', 'pembayaran'];
      reply = `Maaf, saya belum bisa menjawab itu 😅\n\nCoba tanyakan:\n${suggestions.map(s => `• "${s}"`).join('\n')}\n\nAtau langsung browse menu kami! 😊`;
    }

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ message: 'Gagal memproses pesan', error: err.message });
  }
};

module.exports = { chat };
