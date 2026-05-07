// TUGAS:
// Menangani format angka ke Rupiah (IDR)

// Function ini hanya membantu format angka agar tampil rapi di UI
export const formatNumber = (value: number | string) => {
  // Number(...) dipakai untuk memastikan nilai string seperti "21000.00"
  // berubah menjadi number sebelum diformat
  return Number(value).toLocaleString("id-ID");
};