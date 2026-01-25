// Load environment variable (simulated)
const API_KEY = "25b80be532d4a92e5d272b5d99fec6c7768eee3636cd4b7d812b0f47ddf0215d";

async function sendReact() {
    const link = document.getElementById("link").value.trim();
    const emoji = document.getElementById("emoji").value.trim().replace(/\s+/g, ",");
    const resultBox = document.getElementById("result");
    const loading = document.getElementById("loading");
    const submitBtn = document.getElementById("submitBtn");

    if (!link) {
        showResult("❌ Link channel wajib diisi!", "error");
        document.getElementById("link").focus();
        return;
    }

    if (!emoji) {
        showResult("❌ Emoji reaksi wajib diisi!", "error");
        document.getElementById("emoji").focus();
        return;
    }

    // Validasi link WhatsApp
    if (!link.includes('whatsapp.com/channel/')) {
        showResult("❌ Format link tidak valid!\n\nPastikan link berasal dari WhatsApp Channel.\nContoh: https://whatsapp.com/channel/XXXXXXXXXXXXXX", "error");
        return;
    }

    // Validasi emoji (minimal 1 karakter)
    if (emoji.length < 1) {
        showResult("❌ Emoji tidak valid!", "error");
        return;
    }

    // Disable button dan show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    loading.classList.remove("hidden");

    const url = `https://react.whyux-xec.my.id/api/rch?link=${encodeURIComponent(link)}&emoji=${encodeURIComponent(emoji)}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: { 
                "x-api-key": API_KEY,
                "Content-Type": "application/json"
            }
        });

        const json = await res.json();
        
        // Tampilkan hasil
        if (json.success) {
            showResult(
                `✅ REAKSI BERHASIL DIKIRIM!\n\n` +
                `📎 Link   : ${json.link || link}\n` +
                `🎭 Emoji  : ${json.emojis || emoji}\n` +
                `📊 Status : ${json.message || "Berhasil"}\n\n` +
                `⏱️  Reaksi akan muncul dalam beberapa detik di channel.`,
                "success"
            );
            
            // Reset form setelah berhasil
            document.getElementById("link").value = "";
            document.getElementById("emoji").value = "";
            
            // Auto-hide setelah 8 detik
            setTimeout(() => {
                resultBox.classList.add("hidden");
            }, 8000);
            
        } else {
            showResult(
                `❌ GAGAL MENGIRIM REAKSI\n\n` +
                `📛 Pesan  : ${json.message || "Tidak diketahui"}\n` +
                `🔍 Detail : ${json.details || "Tidak ada detail"}\n\n` +
                `⚠️  Periksa link dan coba lagi.`,
                "error"
            );
        }

    } catch (e) {
        showResult(
            `❌ ERROR KONEKSI\n\n` +
            `${e.message}\n\n` +
            `🌐 Pastikan koneksi internet stabil.\n` +
            `🔄 Refresh halaman dan coba lagi.`,
            "error"
        );
    } finally {
        // Enable button dan hide loading
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Reaksi';
        loading.classList.add("hidden");
    }
}

function showResult(message, type) {
    const resultBox = document.getElementById("result");
    resultBox.classList.remove("hidden");
    resultBox.textContent = message;
    
    if (type === "success") {
        resultBox.className = "bg-green-900/30 border border-green-700 p-4 rounded-xl text-sm whitespace-pre-wrap mt-6";
    } else {
        resultBox.className = "bg-red-900/30 border border-red-700 p-4 rounded-xl text-sm whitespace-pre-wrap mt-6";
    }
}

function addEmoji(emoji) {
    const emojiInput = document.getElementById("emoji");
    const currentValue = emojiInput.value.trim();
    
    if (currentValue) {
        emojiInput.value = currentValue + " " + emoji;
    } else {
        emojiInput.value = emoji;
    }
    
    // Focus kembali ke input
    emojiInput.focus();
}

// Enter key support
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendReact();
    }
});

// Clear result when typing
document.getElementById('link').addEventListener('input', function() {
    document.getElementById('result').classList.add('hidden');
});

document.getElementById('emoji').addEventListener('input', function() {
    document.getElementById('result').classList.add('hidden');
});

// Auto-focus on page load
window.addEventListener('load', function() {
    document.getElementById('link').focus();
});
