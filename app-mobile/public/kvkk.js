// KVKK (Turkish Personal Data Protection Law No. 6698) privacy notice shown at
// sign-up. DRAFT: must be reviewed by a lawyer before the congress, and the
// controller's official title and address filled in (CONTROLLER below).
// When the text changes in substance, bump KVKK_VERSION here AND in
// lib/api.js so new consents record which version people accepted.
export const KVKK_VERSION = "2026-11-22";

const CONTROLLER = {
  tr: "AIESEC in Türkiye (EUROXPRO'27 Organizasyon Komitesi)",
  en: "AIESEC in Türkiye (EUROXPRO'27 Organising Committee)",
  email: "contact@euroxpro27.com",
};

// Each section is [heading, paragraphs[]]; a paragraph that is an array is a bullet list.
const TR = {
  title: "KVKK Aydınlatma Metni",
  intro: `Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu'nun ("KVKK") 10. maddesi uyarınca, EUROXPRO'27 delege uygulamasını ("Uygulama") kullanan kişileri kişisel verilerinin işlenmesi hakkında bilgilendirmek için hazırlanmıştır.`,
  sections: [
    ["1. Veri sorumlusu", [`Kişisel verileriniz veri sorumlusu sıfatıyla ${CONTROLLER.tr} tarafından işlenir. İletişim: ${CONTROLLER.email}`]],
    [
      "2. İşlenen kişisel veriler",
      [
        [
          "Kimlik ve iletişim: ad soyad, e-posta adresi",
          "Kurumsal bilgi: bağlı olduğunuz AIESEC birimi (entity) ve pozisyonunuz",
          "Hesap güvenliği: şifrenizin geri döndürülemez özeti (şifrenin kendisi saklanmaz), oturum bilgileri, IP adresi",
          "Profil: isteğe bağlı fotoğraf, emoji ve kısa tanıtım yazısı, dil tercihi",
          "Kartvizit: isteğe bağlı telefon, Instagram, LinkedIn ve e-posta gösterme tercihi (yalnızca QR kodunuzu okutup sizi kaydeden delegeler görür), kaydettiğiniz kişiler ve onlara yazdığınız özel notlar",
          "Uygulama içi etkileşimler: genel sohbet ve özel mesajlar, Meet beğeni ve eşleşmeleri, programınıza eklediğiniz oturumlar, talepler, mağaza rezervasyonları, Explorer Quest ilerlemesi, oturum salonundaki çevrimiçi durumunuz",
          "Bildirim: izin verirseniz anlık bildirim abonelik bilgileri",
        ],
      ],
    ],
    [
      "3. İşleme amaçları",
      [
        [
          "Hesabınızı oluşturmak, kimliğinizi doğrulamak ve kayıt başvurunuzu organizasyon ekibinin onayına sunmak",
          "Kongre programını, duyuruları ve program değişikliklerini size iletmek",
          "Delegeler arasında tanışma, mesajlaşma ve otomatik çeviri hizmetlerini sunmak",
          "Talep, rezervasyon ve etkinlik (Quest, Approvals) süreçlerini yürütmek",
          "Uygulamanın güvenliğini sağlamak, kötüye kullanımı önlemek ve hukuki yükümlülükleri yerine getirmek",
        ],
      ],
    ],
    [
      "4. Hukuki sebepler ve toplama yöntemi",
      [
        "Verileriniz, kayıt formu ve Uygulama kullanımınız sırasında elektronik ortamda, otomatik yollarla toplanır. İşleme, KVKK m. 5/2 kapsamında; bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması (c), veri sorumlusunun hukuki yükümlülüğü (ç), bir hakkın tesisi, kullanılması veya korunması (e) ve temel hak ve özgürlüklerinize zarar vermemek kaydıyla veri sorumlusunun meşru menfaati (f) hukuki sebeplerine dayanır.",
      ],
    ],
    [
      "5. Aktarım ve yurt dışına aktarım",
      [
        "Verileriniz, Uygulamanın çalışması için gerekli olduğu ölçüde barındırma ve veritabanı hizmeti aldığımız sağlayıcılara (Vercel Inc., Upstash Inc.) ve mesajların çevirisi için çeviri hizmeti sağlayıcılarına (ör. DeepL, Google) aktarılır. Bu sağlayıcıların sunucuları Türkiye dışında (AB ve ABD) bulunabilir. Yurt dışına aktarım, KVKK m. 9 uyarınca açık rızanıza dayanılarak yapılır.",
        "Profil bilgileriniz (ad, birim, pozisyon, fotoğraf, tanıtım yazısı) Uygulamadaki diğer onaylı delegeler tarafından görülebilir. Yetkili makamlara ise yalnızca hukuken zorunlu olduğunda aktarım yapılır.",
      ],
    ],
    [
      "6. Saklama süresi",
      [
        "Verileriniz kongrenin sona ermesinden itibaren en geç 6 ay içinde silinir veya anonim hale getirilir. Hesabınızın silinmesini dilediğiniz zaman talep edebilirsiniz; hukuki yükümlülükler için saklanması gereken kayıtlar bu yükümlülük süresince saklanır.",
      ],
    ],
    [
      "7. KVKK m. 11 kapsamındaki haklarınız",
      [
        "Kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini, KVKK m. 7 şartlarıyla silinmesini veya yok edilmesini ve bu işlemlerin aktarılan kişilere bildirilmesini isteme, münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonuç çıkmasına itiraz etme ve kanuna aykırı işleme nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme haklarına sahipsiniz.",
        `Taleplerinizi ${CONTROLLER.email} adresine iletebilirsiniz. Başvurular en geç 30 gün içinde ücretsiz olarak sonuçlandırılır.`,
      ],
    ],
  ],
};

const EN = {
  title: "Privacy notice (KVKK)",
  intro: `This notice is given under Article 10 of the Turkish Personal Data Protection Law No. 6698 ("KVKK") to inform people who use the EUROXPRO'27 delegate app ("the App") about how their personal data is processed. The Turkish version prevails.`,
  sections: [
    ["1. Data controller", [`Your personal data is processed by ${CONTROLLER.en} as data controller. Contact: ${CONTROLLER.email}`]],
    [
      "2. Data we process",
      [
        [
          "Identity and contact: full name, email address",
          "Organisation: your AIESEC entity and position",
          "Account security: a one-way hash of your password (the password itself is never stored), session data, IP address",
          "Profile: optional photo, emoji and short bio, language preference",
          "Business card: optional phone, Instagram, LinkedIn and whether to show your e-mail (seen only by delegates who scan your QR code and save you), the people you saved and your private notes on them",
          "Activity in the App: general chat and direct messages, Meet likes and matches, sessions you add to your programme, requests, store reservations, Explorer Quest progress, your online presence in the plenary hall",
          "Notifications: push subscription details, if you allow them",
        ],
      ],
    ],
    [
      "3. Why we process it",
      [
        [
          "To create your account, sign you in and send your sign-up to the organisers for approval",
          "To bring you the programme, announcements and schedule changes",
          "To let delegates meet, message each other and read automatic translations",
          "To run requests, reservations and activities (Quest, Approvals)",
          "To keep the App secure, prevent abuse and meet legal obligations",
        ],
      ],
    ],
    [
      "4. Legal grounds and how we collect it",
      [
        "We collect your data electronically through the sign-up form and your use of the App. Processing relies on KVKK Art. 5/2: it is directly needed to set up or perform an agreement (c), to meet a legal obligation (ç), to establish, exercise or protect a right (e), and the controller's legitimate interest, provided it does not harm your fundamental rights (f).",
      ],
    ],
    [
      "5. Sharing and transfer abroad",
      [
        "As far as the App needs it, your data is shared with our hosting and database providers (Vercel Inc., Upstash Inc.) and, for translating messages, with translation providers (e.g. DeepL, Google). Their servers may be outside Türkiye (EU and USA). This transfer abroad relies on your explicit consent under KVKK Art. 9.",
        "Your profile (name, entity, position, photo, bio) is visible to other approved delegates in the App. We share data with authorities only when the law requires it.",
      ],
    ],
    [
      "6. How long we keep it",
      [
        "Your data is deleted or anonymised no later than 6 months after the congress ends. You can ask for your account to be deleted at any time; records we must keep by law are kept for as long as that obligation lasts.",
      ],
    ],
    [
      "7. Your rights under KVKK Art. 11",
      [
        "You can ask whether your data is processed and for information about it, learn the purpose and whether it is used accordingly, know who it is shared with, have it corrected, deleted or destroyed (under KVKK Art. 7) and have those recipients told, object to a result against you that comes only from automated analysis, and claim compensation for damage caused by unlawful processing.",
        `Send requests to ${CONTROLLER.email}. We answer free of charge within 30 days.`,
      ],
    ],
  ],
};

// Polish users get the English text; the law only requires Turkish.
export const kvkkText = (lang) => (lang === "tr" ? TR : EN);
