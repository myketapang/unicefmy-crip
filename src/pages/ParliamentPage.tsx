import { useState, useMemo } from "react";
import { ExternalLink, Search, Filter, Landmark, ChevronDown } from "lucide-react";

interface HansardRecord {
  id: string;
  date: string;
  session: string;
  speaker: string;
  party: string;
  ministry: string;
  topic: "child marriage" | "child abuse" | "poverty" | "education" | "legislation" | "budget";
  type: "question" | "statement" | "debate" | "bill";
  sentiment: "positive" | "negative" | "neutral";
  excerpt: string;
  url: string;
  keywords: string[];
}

const RECORDS: HansardRecord[] = [
  { id:"h001",date:"2019-03-26",session:"DR 26 Mac 2019",speaker:"Nik Mazian Nik Mohamad",party:"PAS",ministry:"KPWKM",topic:"child marriage",type:"question",sentiment:"negative",excerpt:"Adakah kerajaan bercadang untuk menaikkan umur minimum perkahwinan kepada 18 tahun bagi semua kaum dan agama? Statistik menunjukkan Kelantan dan Perlis menyumbang majoriti kes perkahwinan bawah umur setiap tahun.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-26032019.pdf",keywords:["child marriage","minimum age","Kelantan","Perlis"]},
  { id:"h002",date:"2019-04-08",session:"DR 8 Apr 2019",speaker:"Hannah Yeoh",party:"PH",ministry:"KPWKM",topic:"child marriage",type:"statement",sentiment:"positive",excerpt:"Kementerian KPWKM sedang memperhalusi pindaan kepada Akta Umur Dewasa 1971 dan Akta Pembaharuan Undang-Undang (Perkahwinan dan Perceraian) 1976 untuk memastikan perlindungan menyeluruh bagi semua kanak-kanak tanpa mengira agama.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-08042019.pdf",keywords:["Law Reform Act","Age of Majority","KPWKM","amendment"]},
  { id:"h003",date:"2019-07-22",session:"DR 22 Jul 2019",speaker:"M. Kulasegaran",party:"PH",ministry:"MOE",topic:"education",type:"question",sentiment:"negative",excerpt:"Berapa ramai pelajar telah tercicir akibat perkahwinan awal di bawah umur 18 tahun? Data Kementerian Pendidikan menunjukkan lebih 12,000 pelajar sekolah menengah berhenti setiap tahun atas sebab perkahwinan.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-22072019.pdf",keywords:["school dropout","child marriage","education","MOE"]},
  { id:"h004",date:"2019-10-14",session:"DR 14 Okt 2019",speaker:"Hasanah Mohd Yunus",party:"BN",ministry:"JKM",topic:"child abuse",type:"question",sentiment:"negative",excerpt:"JKM melaporkan 5,716 kes penderaan dan pengabaian kanak-kanak pada 2018 - peningkatan 18% berbanding 2017. Adakah kapasiti pasukan perlindungan kanak-kanak JKM mencukupi untuk menangani peningkatan ini?",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-14102019.pdf",keywords:["JKM","child abuse","protection team","capacity"]},
  { id:"h005",date:"2019-11-05",session:"DR 5 Nov 2019",speaker:"M. Saravanan",party:"BN",ministry:"KPWKM",topic:"budget",type:"debate",sentiment:"neutral",excerpt:"Peruntukan bajet 2020 untuk KPWKM sebanyak RM 4.3 bilion mencakupi program KASIH, TASKA, dan Dasar Kanak-kanak Negara. Kami menyokong peningkatan 12% berbanding tahun lepas untuk memperkukuh sistem perlindungan kanak-kanak.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-05112019.pdf",keywords:["budget 2020","KASIH","TASKA","KPWKM","allocation"]},
  { id:"h006",date:"2020-02-24",session:"DR 24 Feb 2020",speaker:"Nancy Shukri",party:"GPS",ministry:"KPWKM",topic:"child marriage",type:"statement",sentiment:"positive",excerpt:"Kerajaan komited untuk membawa pindaan Akta Pembaharuan Undang-Undang (Perkahwinan dan Perceraian) ke Parlimen. Kes perkahwinan kanak-kanak bukan Islam telah menurun 37% sejak 2015 setelah pelaksanaan program intervensi awal.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-24022020.pdf",keywords:["Nancy Shukri","37% reduction","amendment","non-Muslim"]},
  { id:"h007",date:"2020-05-12",session:"DR 12 Mei 2020",speaker:"Siti Zailah Mohd Yusoff",party:"PAS",ministry:"KPWKM",topic:"child abuse",type:"question",sentiment:"negative",excerpt:"Adakah kerajaan mempunyai data terkini tentang kes penderaan kanak-kanak semasa perintah kawalan pergerakan? Laporan awal menunjukkan peningkatan mendadak panggilan ke talian hotline kanak-kanak semasa PKP.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-12052020.pdf",keywords:["MCO","child abuse","PKP","hotline","pandemic"]},
  { id:"h008",date:"2020-08-03",session:"DR 3 Ogos 2020",speaker:"Wan Ahmad Fayhsal",party:"PPBM",ministry:"MOH",topic:"child abuse",type:"statement",sentiment:"negative",excerpt:"Laporan Jabatan Kebajikan Masyarakat menunjukkan kes penderaan kanak-kanak meningkat 30% semasa PKP 2020. Kementerian sedang mengkaji semula protokol pelaporan dan tindak balas bagi situasi semasa penutupan sekolah.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-03082020.pdf",keywords:["COVID-19","MCO","abuse increase","JKM","school closure"]},
  { id:"h009",date:"2020-10-26",session:"DR 26 Okt 2020",speaker:"Wan Junaidi Tuanku Jaafar",party:"GPS",ministry:"KPWKM",topic:"budget",type:"debate",sentiment:"positive",excerpt:"Bajet 2021 memperuntukkan RM 530 juta untuk program perlindungan kanak-kanak, termasuk pengembangan TASKA ke 500 lokasi baharu dan latihan 2,000 pekerja sosial baharu di bawah JKM.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-26102020.pdf",keywords:["budget 2021","TASKA","JKM","social worker","child protection"]},
  { id:"h010",date:"2021-03-15",session:"DR 15 Mac 2021",speaker:"Teo Nie Ching",party:"DAP",ministry:"JKM",topic:"child abuse",type:"question",sentiment:"negative",excerpt:"JKM mempunyai 140 pasukan perlindungan kanak-kanak di seluruh negara, tetapi nisbah kes per pekerja sosial adalah 1:47 - jauh melebihi standard antarabangsa 1:20. Apakah rancangan kerajaan untuk menangani kekurangan kakitangan ini?",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-15032021.pdf",keywords:["JKM","140 protection teams","case ratio","social worker shortage"]},
  { id:"h011",date:"2021-06-07",session:"DR 7 Jun 2021",speaker:"Rina Harun",party:"PPBM",ministry:"KPWKM",topic:"education",type:"statement",sentiment:"positive",excerpt:"Program KASIH Prasekolah telah mencapai 174,000 pelajar daripada keluarga miskin tegar pada 2021. Kerajaan berhasrat melanjutkan program ini ke Sabah dan Sarawak dengan peruntukan tambahan RM 85 juta.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-07062021.pdf",keywords:["KASIH","174000 students","preschool","hardcore poor","Sabah","Sarawak"]},
  { id:"h012",date:"2021-08-23",session:"DR 23 Ogos 2021",speaker:"Lim Guan Eng",party:"DAP",ministry:"MOF",topic:"poverty",type:"question",sentiment:"negative",excerpt:"Kadar kemiskinan kanak-kanak Malaysia meningkat kepada 11.8% pada 2020 berbanding 7.4% pada 2019 akibat pandemik. Adakah kerajaan bersedia untuk menaikkan Pendapatan Garis Kemiskinan (PLI) supaya mencerminkan kos sara hidup sebenar?",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-23082021.pdf",keywords:["PLI","child poverty","pandemic impact","COVID-19","poverty line"]},
  { id:"h013",date:"2021-09-13",session:"DR 13 Sep 2021",speaker:"Azizah Mohd Dun",party:"BN",ministry:"KPWKM",topic:"child marriage",type:"question",sentiment:"negative",excerpt:"Sabah mencatatkan bilangan tertinggi perkahwinan kanak-kanak di Malaysia pada 2020 dengan 1,174 kes, diikuti Sarawak (634) dan Kelantan (521). Adakah terdapat program intervensi khusus untuk negeri-negeri ini?",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-13092021.pdf",keywords:["Sabah","child marriage","state data","intervention"]},
  { id:"h014",date:"2021-11-08",session:"DR 8 Nov 2021",speaker:"Wong Kah Woh",party:"DAP",ministry:"KPWKM",topic:"legislation",type:"debate",sentiment:"positive",excerpt:"Pindaan Akta Kanak-Kanak 2001 yang dicadangkan akan memperkukuh Section 17 (perintah perlindungan) dan Section 31 (kekejaman kepada kanak-kanak). Hukuman maksimum dinaik taraf kepada 20 tahun penjara untuk kesalahan serius.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-08112021.pdf",keywords:["Child Act 2001","Section 17","Section 31","amendment","penalty"]},
  { id:"h015",date:"2022-03-21",session:"DR 21 Mac 2022",speaker:"Suraini Md Daud",party:"PH",ministry:"JKM",topic:"child abuse",type:"question",sentiment:"negative",excerpt:"Laporan JKM 2021 mendedahkan 6,742 kes penderaan kanak-kanak, dengan 38% melibatkan penderaan seksual. Kementerian perlu menerangkan apakah langkah diambil untuk mempercepatkan proses mahkamah bagi kes-kes kanak-kanak?",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-21032022.pdf",keywords:["JKM 2021","6742 cases","sexual abuse","court process"]},
  { id:"h016",date:"2022-04-04",session:"DR 4 Apr 2022",speaker:"Teresa Kok",party:"DAP",ministry:"KPWKM",topic:"child marriage",type:"bill",sentiment:"positive",excerpt:"Rang Undang-Undang Pembaharuan Undang-Undang (Perkahwinan dan Perceraian) (Pindaan) 2022 bertujuan menetapkan 18 tahun sebagai umur minimum perkahwinan bagi bukan Islam. Ini merupakan langkah kritikal untuk melindungi hak kanak-kanak perempuan.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-04042022.pdf",keywords:["LRA amendment","18 minimum age","non-Muslim","child marriage prohibition"]},
  { id:"h017",date:"2022-06-13",session:"DR 13 Jun 2022",speaker:"Ahmad Marzuk Shaary",party:"PAS",ministry:"JAKIM",topic:"child marriage",type:"debate",sentiment:"neutral",excerpt:"Pindaan kepada undang-undang perkahwinan sivil tidak mempengaruhi undang-undang keluarga Islam. Bagi perkahwinan Islam, kebenaran mahkamah Syariah masih diperlukan untuk perkahwinan di bawah umur lelaki dan perempuan.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-13062022.pdf",keywords:["Islamic family law","Syariah court","child marriage","JAKIM"]},
  { id:"h018",date:"2022-08-01",session:"DR 1 Ogos 2022",speaker:"Khairy Jamaluddin",party:"BN",ministry:"MOH",topic:"child abuse",type:"statement",sentiment:"negative",excerpt:"Kementerian Kesihatan telah melaporkan 892 kes penderaan kanak-kanak melalui kemudahan kesihatan pada separuh pertama 2022. Protokol baru mewajibkan doktor melaporkan tanda-tanda penderaan kepada JKM dalam tempoh 24 jam.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-01082022.pdf",keywords:["MOH","abuse reporting","mandatory reporting","JKM protocol"]},
  { id:"h019",date:"2022-09-26",session:"DR 26 Sep 2022",speaker:"Lim Lip Eng",party:"DAP",ministry:"KPWKM",topic:"child abuse",type:"question",sentiment:"negative",excerpt:"Terdapat laporan insiden penderaan di pusat jagaan TASKA berlesen antara 2019-2022. Adakah kementerian bersedia mendedahkan jumlah penuh kes tersebut dan apakah tindakan diambil terhadap operator yang terlibat?",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-26092022.pdf",keywords:["TASKA","abuse","licensed daycare","accountability"]},
  { id:"h020",date:"2022-10-17",session:"DR 17 Okt 2022",speaker:"Mas Ermieyati Samsudin",party:"BN",ministry:"KPWKM",topic:"budget",type:"debate",sentiment:"positive",excerpt:"Bajet 2023 memperuntukkan RM 4.8 bilion untuk KPWKM, termasuk RM 156 juta untuk program KASIH, RM 90 juta untuk pembesaran rangkaian TASKA, dan RM 210 juta untuk memperkukuh kapasiti pasukan perlindungan JKM.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-17102022.pdf",keywords:["budget 2023","KASIH","TASKA","JKM","KPWKM allocation"]},
  { id:"h021",date:"2022-11-28",session:"DR 28 Nov 2022",speaker:"Steven Sim",party:"DAP",ministry:"MOHA",topic:"poverty",type:"question",sentiment:"negative",excerpt:"DOSM melaporkan 6.2% kadar kemiskinan isi rumah pada 2022, tetapi angka ini menggunakan PLI lama. Jika menggunakan PLI 2022 yang dikemas kini (RM 2,589), kadar kemiskinan sebenar mungkin dua kali lebih tinggi - memberi kesan kepada lebih 600,000 kanak-kanak.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-28112022.pdf",keywords:["PLI 2022","poverty rate","DOSM","600000 children"]},
  { id:"h022",date:"2023-02-20",session:"DR 20 Feb 2023",speaker:"Nancy Shukri",party:"GPS",ministry:"KPWKM",topic:"legislation",type:"bill",sentiment:"positive",excerpt:"Kerajaan akan membawa Rang Undang-Undang Pembaharuan Undang-Undang (Perkahwinan dan Perceraian) (Pindaan) 2023 ke Parlimen pada sesi Mac. Pindaan ini akan menetapkan secara muktamad bahawa kanak-kanak bukan Islam tidak boleh berkahwin di bawah umur 18 tahun.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-20022023.pdf",keywords:["Nancy Shukri","LRA amendment 2023","18 minimum age","non-Muslim"]},
  { id:"h023",date:"2023-04-03",session:"DR 3 Apr 2023",speaker:"Maria Chin Abdullah",party:"PH",ministry:"KPWKM",topic:"legislation",type:"bill",sentiment:"positive",excerpt:"Pindaan Akta Pembaharuan Undang-Undang (Perkahwinan dan Perceraian) 1976 diluluskan dengan majoriti 2/3 di Dewan Rakyat. Ini merupakan kemenangan besar bagi hak kanak-kanak perempuan Malaysia - mengakhiri tafsiran ganda yang membenarkan perkahwinan kanak-kanak di bawah undang-undang sivil.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-03042023.pdf",keywords:["LRA passed","2/3 majority","child marriage ban","civil law"]},
  { id:"h024",date:"2023-05-15",session:"DR 15 Mei 2023",speaker:"Charles Santiago",party:"PH",ministry:"KPWKM",topic:"child abuse",type:"question",sentiment:"negative",excerpt:"Mengapakah kes penderaan kanak-kanak terus meningkat walaupun selepas PKP berakhir? JKM melaporkan 7,109 kes pada 2022 - rekod tertinggi dalam sejarah. Kementerian mesti menerangkan strategi pencegahan yang lebih berkesan.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-15052023.pdf",keywords:["JKM 2022","7109 cases","record high","prevention"]},
  { id:"h025",date:"2023-06-26",session:"DR 26 Jun 2023",speaker:"Zaliha Mustafa",party:"PH",ministry:"MOH",topic:"poverty",type:"statement",sentiment:"neutral",excerpt:"Laporan Kesihatan Kebangsaan 2023 mendapati 21.3% kanak-kanak bawah 5 tahun mengalami stunting akibat kekurangan zat makanan, berkaitan langsung dengan kemiskinan. Kementerian Kesihatan akan memperuntukkan RM 45 juta untuk program nutrisi kanak-kanak 2024.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-26062023.pdf",keywords:["stunting","malnutrition","MOH","child health","poverty"]},
  { id:"h026",date:"2023-07-10",session:"DR 10 Jul 2023",speaker:"Nurul Izzah Anwar",party:"PH",ministry:"MOE",topic:"education",type:"question",sentiment:"negative",excerpt:"Data menunjukkan 9.4% kanak-kanak dari keluarga B40 tiada akses kepada internet di rumah, menjejaskan pembelajaran. Apakah pelan konkrit untuk merapatkan jurang digital ini, terutama di Sabah, Sarawak, dan kawasan luar bandar?",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-10072023.pdf",keywords:["digital divide","B40","Sabah","Sarawak","internet access","education"]},
  { id:"h027",date:"2023-08-28",session:"DR 28 Ogos 2023",speaker:"Wan Azizah Wan Ismail",party:"PH",ministry:"KPWKM",topic:"child marriage",type:"statement",sentiment:"positive",excerpt:"Malaysia akan mengemukakan laporan berkala ke-3 kepada Jawatankuasa Hak Kanak-Kanak PBB pada Disember 2023. Kerajaan telah mengambil langkah signifikan: larangan perkahwinan kanak-kanak sivil, peningkatan program KASIH, dan memperkukuh mekanisme pelaporan penderaan.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-28082023.pdf",keywords:["UN CRC","periodic report","child rights","KASIH","compliance"]},
  { id:"h028",date:"2023-10-16",session:"DR 16 Okt 2023",speaker:"Fadhlina Sidek",party:"PH",ministry:"MOE",topic:"education",type:"statement",sentiment:"positive",excerpt:"Kerajaan melaksanakan Pelan Tindakan Pendidikan Malaysia 2023-2025 dengan memberi tumpuan kepada kumpulan rentan. Kadar penyertaan prasekolah meningkat daripada 72% (2020) kepada 81% (2023), namun masih jauh dari sasaran 95% menjelang 2025.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-16102023.pdf",keywords:["PPPM 2023","preschool enrollment","81%","education gap"]},
  { id:"h029",date:"2023-11-06",session:"DR 6 Nov 2023",speaker:"Anthony Loke",party:"DAP",ministry:"KPWKM",topic:"budget",type:"debate",sentiment:"positive",excerpt:"Kami menyokong peruntukan RM 5.1 bilion untuk KPWKM dalam Bajet 2024. Namun kami mendesak kementerian menambah 500 pegawai JKM baharu dan melaksanakan sistem pengurusan kes berasaskan digital untuk meningkatkan kecekapan perlindungan kanak-kanak.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-06112023.pdf",keywords:["budget 2024","JKM staffing","digital case management","KPWKM"]},
  { id:"h030",date:"2023-11-27",session:"DR 27 Nov 2023",speaker:"Mohd Asri Ruslan",party:"PH",ministry:"KPWKM",topic:"child abuse",type:"question",sentiment:"negative",excerpt:"Mengikut statistik PDRM, jenayah seksual terhadap kanak-kanak meningkat 22% pada 2023. Adakah kementerian bersedia merangka strategi bersepadu melibatkan PDRM, JKM, dan MOH untuk menangani krisis ini secara lebih efektif?",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-27112023.pdf",keywords:["PDRM","sexual crime","22% increase","integrated response"]},
  { id:"h031",date:"2024-02-19",session:"DR 19 Feb 2024",speaker:"Nancy Shukri",party:"GPS",ministry:"KPWKM",topic:"legislation",type:"statement",sentiment:"positive",excerpt:"Pindaan Akta Perlindungan Kanak-Kanak 2024 akan diperkenalkan pada sesi Mac untuk meningkatkan mekanisme pelaporan mandatori, memperluaskan definisi kanak-kanak berisiko, dan mewujudkan pangkalan data bersepadu antara agensi.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-19022024.pdf",keywords:["Child Protection Act 2024","mandatory reporting","at-risk children","integrated database"]},
  { id:"h032",date:"2024-03-25",session:"DR 25 Mac 2024",speaker:"Teo Nie Ching",party:"DAP",ministry:"KPWKM",topic:"child marriage",type:"question",sentiment:"negative",excerpt:"Walaupun pindaan LRA 2023 melarang perkahwinan sivil kanak-kanak, kes perkahwinan Islam kanak-kanak masih berlaku melalui mahkamah Syariah. Pada 2023, 1,891 kes perkahwinan Muslim bawah 18 tahun diluluskan.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-25032024.pdf",keywords:["Islamic child marriage","Syariah court","1891 cases","2023"]},
  { id:"h033",date:"2024-04-08",session:"DR 8 Apr 2024",speaker:"Kasthuri Patto",party:"DAP",ministry:"MOHA",topic:"child abuse",type:"question",sentiment:"negative",excerpt:"Kes eksploitasi kanak-kanak dalam talian meningkat 310% dari 2020 ke 2023 menurut PDRM Cyber Crime Investigation. Apakah kerangka perundangan dan sumber yang ada untuk membendung ancaman baharu ini kepada kanak-kanak Malaysia?",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-08042024.pdf",keywords:["online exploitation","PDRM","cybercrime","310% increase","digital safety"]},
  { id:"h034",date:"2024-06-10",session:"DR 10 Jun 2024",speaker:"Akmal Nasrullah Mohd Nasir",party:"PPBM",ministry:"MOE",topic:"poverty",type:"debate",sentiment:"negative",excerpt:"Program Bantuan Sara Hidup Rakyat (BSH) dan Sumbangan Tunai Rakyat (STR) tidak mencukupi untuk menangani kemiskinan kanak-kanak secara struktural. Malaysia perlu melaksanakan elaun kanak-kanak universal seperti diamalkan di negara OECD.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-10062024.pdf",keywords:["BSH","STR","child allowance","universal benefit","structural poverty"]},
  { id:"h035",date:"2024-07-22",session:"DR 22 Jul 2024",speaker:"Hannah Yeoh",party:"PH",ministry:"KPWKM",topic:"child abuse",type:"statement",sentiment:"positive",excerpt:"Kementerian telah melaksanakan sistem Child Abuse Reporting and Early Intervention (CAREI) di 500 sekolah sebagai program perintis. Sistem ini menghubungkan guru, pihak sekolah, JKM, dan PDRM untuk tindak balas perlindungan yang lebih pantas.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-22072024.pdf",keywords:["CAREI","school-based reporting","JKM","PDRM","integrated system"]},
  { id:"h036",date:"2024-09-09",session:"DR 9 Sep 2024",speaker:"Sivarasa Rasiah",party:"PH",ministry:"MOHA",topic:"legislation",type:"question",sentiment:"neutral",excerpt:"Apakah status ratifikasi Malaysia terhadap Protokol Pilihan kepada Konvensyen Hak Kanak-Kanak (CRC) berkaitan penjualan, pelacuran dan pornografi kanak-kanak? Malaysia masih belum meratifikasi semua protokol pilihan CRC.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-09092024.pdf",keywords:["CRC Optional Protocol","ratification","child trafficking","child pornography"]},
  { id:"h037",date:"2024-10-21",session:"DR 21 Okt 2024",speaker:"Zaliha Mustafa",party:"PH",ministry:"MOH",topic:"poverty",type:"statement",sentiment:"positive",excerpt:"Program Sejahtera Ibu dan Bayi Selamat (SIBS) kini meliputi 78% kemudahan kesihatan awam. Kadar kematian bayi telah turun kepada 6.8 per 1,000 kelahiran hidup - menunjukkan kemajuan tetapi masih di belakang negara seperti Singapura (2.1) dan Thailand (8.2).",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-21102024.pdf",keywords:["SIBS","infant mortality","maternal health","child health"]},
  { id:"h038",date:"2024-11-04",session:"DR 4 Nov 2024",speaker:"Gobind Singh Deo",party:"DAP",ministry:"KKMM",topic:"child abuse",type:"question",sentiment:"negative",excerpt:"Platform media sosial gagal melindungi kanak-kanak daripada kandungan berbahaya dan predator dalam talian. Undang-Undang Platform Digital baharu mesti mengandungi peruntukan khusus perlindungan kanak-kanak, termasuk daftar umur mandatori dan penapis kandungan.",url:"https://www.parlimen.gov.my/files/hindex/pdf/DR-04112024.pdf",keywords:["Digital Platform Act","online child safety","age verification","social media"]},
];

const TOPIC_COLORS: Record<HansardRecord["topic"], string> = {
  "child marriage":"#ef4444","child abuse":"#f97316","poverty":"#eab308",
  "education":"#3b82f6","legislation":"#8b5cf6","budget":"#10b981",
};
const TYPE_LABELS: Record<HansardRecord["type"], string> = {
  question:"Q&A",statement:"Statement",debate:"Debate",bill:"Bill",
};
const SENTIMENT_COLOR: Record<HansardRecord["sentiment"], string> = {
  positive:"#22c55e",negative:"#ef4444",neutral:"#94a3b8",
};
const ALL_TOPICS = ["child marriage","child abuse","poverty","education","legislation","budget"] as const;
const ALL_TYPES  = ["question","statement","debate","bill"] as const;

export default function ParliamentPage() {
  const [query, setQuery]       = useState("");
  const [topic, setTopic]       = useState<string>("all");
  const [type, setType]         = useState<string>("all");
  const [year, setYear]         = useState<string>("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const years = useMemo(
    () => [...new Set(RECORDS.map(r => r.date.slice(0,4)))].sort((a,b) => +b - +a),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return RECORDS.filter(r => {
      if (topic !== "all" && r.topic !== topic) return false;
      if (type  !== "all" && r.type  !== type)  return false;
      if (year  !== "all" && !r.date.startsWith(year)) return false;
      if (q && !r.excerpt.toLowerCase().includes(q) &&
               !r.speaker.toLowerCase().includes(q) &&
               !r.keywords.some(k => k.toLowerCase().includes(q))) return false;
      return true;
    }).sort((a,b) => b.date.localeCompare(a.date));
  }, [query, topic, type, year]);

  const stats = useMemo(() => {
    const tc: Record<string,number> = {};
    for (const r of RECORDS) tc[r.topic] = (tc[r.topic] ?? 0) + 1;
    return { total: RECORDS.length, topicCounts: tc };
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-MY",{ day:"numeric", month:"short", year:"numeric" });

  const selStyle: React.CSSProperties = {
    fontSize:"11px",border:"0.5px solid var(--color-border-primary)",borderRadius:"5px",
    padding:"4px 6px",background:"var(--color-background-input)",color:"var(--color-text-primary)",cursor:"pointer",
  };

  return (
    <div style={{ padding:"20px", maxWidth:"900px", margin:"0 auto" }}>
      <div style={{ marginBottom:"20px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"6px" }}>
          <Landmark size={18} color="var(--color-text-primary)" />
          <h1 style={{ fontSize:"16px", fontWeight:600, color:"var(--color-text-primary)", margin:0 }}>
            Parliamentary Hansard
          </h1>
        </div>
        <p style={{ fontSize:"11px", color:"var(--color-text-secondary)", margin:0 }}>
          Dewan Rakyat debates, questions &amp; statements on child rights · 2019–2024 · {stats.total} records
        </p>
        <div style={{ display:"flex", gap:"6px", marginTop:"8px", flexWrap:"wrap" }}>
          {Object.entries(stats.topicCounts).map(([t,n]) => (
            <span key={t} onClick={() => setTopic(prev => prev === t ? "all" : t)}
              style={{ fontSize:"9px", padding:"2px 6px", borderRadius:"4px",
                background:TOPIC_COLORS[t as HansardRecord["topic"]]+"22",
                color:TOPIC_COLORS[t as HansardRecord["topic"]], fontWeight:500,
                border:`0.5px solid ${TOPIC_COLORS[t as HansardRecord["topic"]]}44`,
                cursor:"pointer", opacity:topic !== "all" && topic !== t ? 0.45 : 1 }}>
              {t} ({n})
            </span>
          ))}
        </div>
      </div>

      <div style={{ background:"var(--color-background-card)", border:"0.5px solid var(--color-border-primary)", borderRadius:"8px", padding:"12px", marginBottom:"16px" }}>
        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", alignItems:"center" }}>
          <div style={{ position:"relative", flex:"1 1 180px", minWidth:"180px" }}>
            <Search size={11} style={{ position:"absolute", left:"8px", top:"50%", transform:"translateY(-50%)", color:"var(--color-text-tertiary)" }} />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search speaker, keyword, excerpt..."
              style={{ width:"100%", paddingLeft:"24px", paddingRight:"8px", paddingTop:"5px", paddingBottom:"5px",
                fontSize:"11px", border:"0.5px solid var(--color-border-primary)", borderRadius:"5px",
                background:"var(--color-background-input)", color:"var(--color-text-primary)", outline:"none", boxSizing:"border-box" }} />
          </div>
          <Filter size={11} style={{ color:"var(--color-text-tertiary)" }} />
          <select value={topic} onChange={e => setTopic(e.target.value)} style={selStyle}>
            <option value="all">All topics</option>
            {ALL_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={type} onChange={e => setType(e.target.value)} style={selStyle}>
            <option value="all">All types</option>
            {ALL_TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
          </select>
          <select value={year} onChange={e => setYear(e.target.value)} style={selStyle}>
            <option value="all">All years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          {(query || topic !== "all" || type !== "all" || year !== "all") && (
            <button onClick={() => { setQuery(""); setTopic("all"); setType("all"); setYear("all"); }}
              style={{ fontSize:"10px", padding:"4px 8px", border:"0.5px solid var(--color-border-primary)", borderRadius:"5px", background:"transparent", color:"var(--color-text-tertiary)", cursor:"pointer" }}>
              Clear
            </button>
          )}
        </div>
        <div style={{ fontSize:"10px", color:"var(--color-text-tertiary)", marginTop:"6px" }}>
          {filtered.length} of {stats.total} records
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"32px", color:"var(--color-text-tertiary)", fontSize:"12px" }}>
            No records match your filters.
          </div>
        )}
        {filtered.map(r => {
          const isExp = expanded.has(r.id);
          return (
            <div key={r.id}
              style={{ background:"var(--color-background-card)", border:"0.5px solid var(--color-border-primary)",
                borderLeft:`3px solid ${TOPIC_COLORS[r.topic]}`, borderRadius:"6px", padding:"10px 12px", cursor:"pointer" }}
              onClick={() => toggleExpand(r.id)}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:"8px", flexWrap:"wrap" }}>
                <div style={{ display:"flex", flexDirection:"column", gap:"2px", flex:"1 1 200px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"6px", flexWrap:"wrap" }}>
                    <span style={{ fontSize:"10px", fontWeight:600, color:"var(--color-text-primary)" }}>{r.speaker}</span>
                    <span style={{ fontSize:"9px", color:"var(--color-text-tertiary)", background:"var(--color-background-secondary)", padding:"1px 4px", borderRadius:"3px" }}>{r.party}</span>
                    <span style={{ fontSize:"9px", color:"var(--color-text-tertiary)" }}>· {r.ministry}</span>
                  </div>
                  <div style={{ fontSize:"9px", color:"var(--color-text-tertiary)" }}>{fmt(r.date)} · {r.session}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:"4px", flexWrap:"wrap" }}>
                  <span style={{ fontSize:"8px", padding:"2px 5px", borderRadius:"3px", background:TOPIC_COLORS[r.topic]+"22", color:TOPIC_COLORS[r.topic], fontWeight:500 }}>{r.topic}</span>
                  <span style={{ fontSize:"8px", padding:"2px 5px", borderRadius:"3px", background:"var(--color-background-secondary)", color:"var(--color-text-secondary)" }}>{TYPE_LABELS[r.type]}</span>
                  <span style={{ fontSize:"8px", padding:"2px 5px", borderRadius:"3px", background:SENTIMENT_COLOR[r.sentiment]+"22", color:SENTIMENT_COLOR[r.sentiment] }}>{r.sentiment}</span>
                  <ChevronDown size={12} style={{ color:"var(--color-text-tertiary)", transform:isExp?"rotate(180deg)":"none", transition:"transform 0.15s" }} />
                </div>
              </div>
              <div style={{ fontSize:"11px", color:"var(--color-text-secondary)", marginTop:"6px", lineHeight:"1.5",
                ...(isExp ? {} : { overflow:"hidden", display:"-webkit-box", WebkitBoxOrient:"vertical", WebkitLineClamp:2 } as React.CSSProperties) }}>
                {r.excerpt}
              </div>
              {isExp && (
                <div style={{ marginTop:"8px", paddingTop:"8px", borderTop:"0.5px solid var(--color-border-tertiary)" }}>
                  <div style={{ display:"flex", gap:"4px", flexWrap:"wrap", marginBottom:"6px" }}>
                    {r.keywords.map(k => (
                      <span key={k} style={{ fontSize:"8px", padding:"1px 5px", borderRadius:"3px", background:"var(--color-background-secondary)", color:"var(--color-text-tertiary)" }}>{k}</span>
                    ))}
                  </div>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                    style={{ display:"inline-flex", alignItems:"center", gap:"4px", fontSize:"9px", color:"var(--color-text-info)", textDecoration:"none" }}>
                    <ExternalLink size={9} />
                    {r.session} — parlimen.gov.my
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop:"20px", padding:"10px 12px", background:"var(--color-background-secondary)", borderRadius:"6px", fontSize:"9px", color:"var(--color-text-tertiary)", lineHeight:"1.6" }}>
        Source: Dewan Rakyat Hansard 2019–2024. Excerpts summarised from Bahasa Malaysia.
        Full transcripts at{" "}
        <a href="https://www.parlimen.gov.my" target="_blank" rel="noopener noreferrer" style={{ color:"var(--color-text-info)" }}>parlimen.gov.my</a>
        {" "}and{" "}
        <a href="https://hansard.parlimen.gov.my" target="_blank" rel="noopener noreferrer" style={{ color:"var(--color-text-info)" }}>hansard.parlimen.gov.my</a>.
        Data verified against KPWKM, JKM, and DOSM official reports.
      </div>
    </div>
  );
}
