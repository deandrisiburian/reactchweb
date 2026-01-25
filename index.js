const API_KEY = "25b80be532d4a92e5d272b5d99fec6c7768eee3636cd4b7d812b0f47ddf0215d";

async function sendReact() {
  const link = document.getElementById("link").value.trim();
  const emoji = document.getElementById("emoji").value.trim().replace(/\s+/g, ",");
  const resultBox = document.getElementById("result");

  if (!link || !emoji) {
    alert("Link dan emoji wajib diisi!");
    return;
  }

  const url = `https://react.whyux-xec.my.id/api/rch?link=${encodeURIComponent(link)}&emoji=${encodeURIComponent(emoji)}`;

  resultBox.classList.remove("hidden");
  resultBox.textContent = "Mengirim reaksi...";

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { 
        "x-api-key": API_KEY,
        "Content-Type": "application/json"
      }
    });

    const json = await res.json();
    
    // Tampilkan data respons lebih detail
    if (json.success) {
      resultBox.textContent = `✅ SUCCESS\n\nLink   : ${json.link || "-"}\nEmojis : ${json.emojis || "-"}\nStatus : ${json.message || "Berhasil"}`;
      resultBox.className = "bg-green-900/30 border-green-700 p-4 rounded-xl text-sm whitespace-pre-wrap";
      
      // Reset form setelah berhasil
      document.getElementById("link").value = "";
      document.getElementById("emoji").value = "";
      
      // Auto-hide setelah 5 detik
      setTimeout(() => {
        resultBox.classList.add("hidden");
      }, 5000);
    } else {
      resultBox.textContent = `❌ GAGAL\n\nPesan  : ${json.message || "Tidak diketahui"}\nDetail : ${json.details || "Tidak ada detail"}`;
      resultBox.className = "bg-red-900/30 border-red-700 p-4 rounded-xl text-sm whitespace-pre-wrap";
    }

  } catch (e) {
    resultBox.textContent = `❌ Error: ${e.message}\n\nPastikan koneksi internet stabil.`;
    resultBox.className = "bg-red-900/30 border-red-700 p-4 rounded-xl text-sm whitespace-pre-wrap";
  }
}

// Enter key support
document.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    sendReact();
  }
});
