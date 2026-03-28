-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'de',
  status TEXT,
  city_plz TEXT,
  goal TEXT,
  onboarding_done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create checklist_items table
CREATE TABLE checklist_items (
  id SERIAL PRIMARY KEY,
  status_type TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  title_de TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_tr TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  title_ku_sorani TEXT NOT NULL,
  title_ku_kurmanji TEXT NOT NULL,
  title_fa TEXT NOT NULL,
  description_de TEXT,
  description_en TEXT,
  description_tr TEXT,
  description_ar TEXT,
  description_ku_sorani TEXT,
  description_ku_kurmanji TEXT,
  description_fa TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_checklist_progress table
CREATE TABLE user_checklist_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL REFERENCES checklist_items(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_checklist_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for checklist_items (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view checklist items"
  ON checklist_items FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_checklist_progress
CREATE POLICY "Users can view own progress"
  ON user_checklist_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_checklist_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_checklist_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON user_checklist_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_checklist_progress_updated_at
  BEFORE UPDATE ON user_checklist_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed data for checklist_items
-- Asylum Seeker checklist
INSERT INTO checklist_items (status_type, order_index, title_de, title_en, title_tr, title_ar, title_ku_sorani, title_ku_kurmanji, title_fa, description_de, description_en, description_tr, description_ar, description_ku_sorani, description_ku_kurmanji, description_fa) VALUES
('asylum', 1, 'Asylantrag stellen', 'Submit asylum application', 'İltica başvurusu yap', 'تقديم طلب اللجوء', 'پێشکەشکردنی داواکاری پەناهندەیی', 'Daxwaza penaberiyê pêşkêş bike', 'ارائه درخواست پناهندگی', 'Beim BAMF den Asylantrag einreichen', 'Submit your asylum application to BAMF', 'BAMF'a iltica başvurunuzu yapın', 'قدم طلب اللجوء إلى BAMF', 'داواکاریەکەت پێشکەش بە BAMF بکە', 'Daxwaza xwe pêşkêşî BAMF bike', 'درخواست خود را به BAMF ارائه دهید'),
('asylum', 2, 'Anhörung vorbereiten', 'Prepare for hearing', 'Görüşmeye hazırlan', 'التحضير للجلسة', 'ئامادەکاری بۆ بیستنەوە', 'Ji bo dîtinê amade bibe', 'آماده شدن برای جلسه', 'Dokumente und Fluchtgründe zusammenstellen', 'Gather documents and reasons for asylum', 'Belgeleri ve iltica nedenlerini toplayın', 'اجمع المستندات وأسباب اللجوء', 'بەڵگەکان و هۆکارەکانی پەناهندەیی کۆبکەرەوە', 'Belgeyan û sedemên penaberiyê berhev bike', 'مدارک و دلایل پناهندگی را جمع آوری کنید'),
('asylum', 3, 'Aufenthaltsgestattung erhalten', 'Receive residence permit', 'Oturma izni al', 'الحصول على إذن الإقامة', 'وەرگرتنی مۆڵەتی نیشتەجێبوون', 'Destûra niştecihbûnê bistîne', 'دریافت مجوز اقامت', 'Bescheinigung über die Gestattung des Aufenthalts', 'Certificate of permission to reside', 'İkamet izni belgesi', 'شهادة إذن الإقامة', 'بڕوانامەی مۆڵەتی نیشتەجێبوون', 'Belgeya destûra niştecihbûnê', 'گواهی مجوز اقامت'),
('asylum', 4, 'Integrationskurs anmelden', 'Enroll in integration course', 'Entegrasyon kursuna kayıt ol', 'التسجيل في دورة الاندماج', 'تۆمارکردن لە خولی یەکگرتنەوە', 'Di kursên yekgirtinê de qeyd bibe', 'ثبت نام در دوره یکپارچه سازی', 'Deutsch- und Orientierungskurs besuchen', 'Attend German and orientation course', 'Almanca ve oryantasyon kursuna katılın', 'احضر دورة اللغة الألمانية والتوجيه', 'بەشداری لە خولی ئەڵمانی و ئاراستەکردن بکە', 'Di kursên Almanî û rêberiyê de beşdar bibe', 'در دوره آلمانی و جهت یابی شرکت کنید'),
('asylum', 5, 'Arbeitserlaubnis beantragen', 'Apply for work permit', 'Çalışma izni başvurusu', 'التقدم بطلب للحصول على تصريح عمل', 'داواکاری مۆڵەتی کارکردن', 'Ji bo destûra xebatê daxwaz bike', 'درخواست مجوز کار', 'Nach 3 Monaten kann Arbeitserlaubnis beantragt werden', 'Work permit can be applied for after 3 months', '3 ay sonra çalışma izni başvurusu yapılabilir', 'يمكن التقدم للحصول على تصريح العمل بعد 3 أشهر', 'دوای ٣ مانگ دەتوانیت داواکاری مۆڵەتی کارکردن بکەیت', 'Piştî 3 mehan dikare ji bo destûra xebatê daxwaz bike', 'پس از 3 ماه می توان درخواست مجوز کار داد');

-- EU Citizen checklist
INSERT INTO checklist_items (status_type, order_index, title_de, title_en, title_tr, title_ar, title_ku_sorani, title_ku_kurmanji, title_fa, description_de, description_en, description_tr, description_ar, description_ku_sorani, description_ku_kurmanji, description_fa) VALUES
('eu_citizen', 1, 'Anmeldung beim Bürgeramt', 'Register at citizens office', 'Nüfus dairesine kayıt', 'التسجيل في مكتب المواطنين', 'تۆمارکردن لە دەفتەری شارۆمەندان', 'Di ofîsa welatîyan de qeyd bibe', 'ثبت نام در اداره شهروندی', 'Wohnsitz innerhalb von 2 Wochen anmelden', 'Register residence within 2 weeks', 'İkameti 2 hafta içinde kayıt ettirin', 'سجل الإقامة خلال أسبوعين', 'لە ماوەی ٢ هەفتە نیشتەجێبوون تۆمار بکە', 'Di nav 2 hefteyan de niştecihbûnê qeyd bike', 'محل سکونت را ظرف 2 هفته ثبت کنید'),
('eu_citizen', 2, 'Krankenversicherung abschließen', 'Get health insurance', 'Sağlık sigortası yaptır', 'الحصول على تأمين صحي', 'بیمەی تەندروستی دابین بکە', 'Bîmeya tenduristiyê bistîne', 'دریافت بیمه درمانی', 'Gesetzliche oder private Krankenversicherung', 'Public or private health insurance', 'Kamu veya özel sağlık sigortası', 'التأمين الصحي العام أو الخاص', 'بیمەی تەندروستی گشتی یان تایبەت', 'Bîmeya tenduristiya giştî an taybet', 'بیمه درمانی عمومی یا خصوصی'),
('eu_citizen', 3, 'Steuernummer beantragen', 'Apply for tax number', 'Vergi numarası başvurusu', 'التقدم بطلب للحصول على رقم ضريبي', 'داواکاری ژمارەی باج', 'Ji bo hejmara bacê daxwaz bike', 'درخواست شماره مالیاتی', 'Beim Finanzamt die Steuernummer holen', 'Get tax number from tax office', 'Vergi dairesinden vergi numarası alın', 'احصل على الرقم الضريبي من مكتب الضرائب', 'ژمارەی باج لە فەرمانگەی باج وەربگرە', 'Ji ofîsa bacê hejmara bacê bistîne', 'شماره مالیاتی را از اداره مالیات دریافت کنید'),
('eu_citizen', 4, 'Bankkonto eröffnen', 'Open bank account', 'Banka hesabı aç', 'فتح حساب مصرفي', 'هەژماری بانکی بکەرەوە', 'Hesabê bankayê veke', 'افتتاح حساب بانکی', 'Girokonto bei einer deutschen Bank eröffnen', 'Open current account at German bank', 'Alman bankasında cari hesap açın', 'افتح حساب جاري في بنك ألماني', 'هەژماری ئێستا لە بانکێکی ئەڵمانی بکەرەوە', 'Di bankaya Alman de hesabê roj veke', 'حساب جاری در بانک آلمانی باز کنید'),
('eu_citizen', 5, 'Führerschein umschreiben', 'Convert driving license', 'Ehliyet çevir', 'تحويل رخصة القيادة', 'مۆڵەتنامەی شۆفێری بگۆڕە', 'Lîsansa ajotinê biguherîne', 'تبدیل گواهینامه رانندگی', 'EU-Führerschein ist in Deutschland gültig', 'EU driving license is valid in Germany', 'AB ehliyeti Almanya'da geçerlidir', 'رخصة القيادة الأوروبية صالحة في ألمانيا', 'مۆڵەتنامەی یەکێتی ئەورووپا لە ئەڵمانیا بەکارهێنراوە', 'Lîsansa EU li Almanyayê derbasdar e', 'گواهینامه اتحادیه اروپا در آلمان معتبر است');

-- Skilled Worker checklist
INSERT INTO checklist_items (status_type, order_index, title_de, title_en, title_tr, title_ar, title_ku_sorani, title_ku_kurmanji, title_fa, description_de, description_en, description_tr, description_ar, description_ku_sorani, description_ku_kurmanji, description_fa) VALUES
('skilled_worker', 1, 'Visum beantragen', 'Apply for visa', 'Vize başvurusu', 'التقدم بطلب للحصول على تأشيرة', 'داواکاری ڤیزا', 'Ji bo vîzayê daxwaz bike', 'درخواست ویزا', 'Nationales Visum bei deutscher Botschaft', 'National visa at German embassy', 'Alman büyükelçiliğinde ulusal vize', 'التأشيرة الوطنية في السفارة الألمانية', 'ڤیزای نیشتمانی لە باڵیۆزخانەی ئەڵمانیا', 'Vîzaya neteweyî li vekşîna Alman', 'ویزای ملی در سفارت آلمان'),
('skilled_worker', 2, 'Anerkennung der Qualifikation', 'Recognition of qualifications', 'Nitelik tanıma', 'الاعتراف بالمؤهلات', 'ناسینەوەی بڕوانامەکان', 'Naskirina qualîfîkasyonan', 'شناسایی مدارک تحصیلی', 'Berufsabschluss anerkennen lassen', 'Get professional degree recognized', 'Meslek derecesini tanıtın', 'احصل على اعتراف بدرجتك المهنية', 'پلەی پیشەیی ناسراو بکە', 'Pîleya pîşeyî nas bike', 'مدرک حرفه ای را شناسایی کنید'),
('skilled_worker', 3, 'Arbeitsvertrag abschließen', 'Sign employment contract', 'İş sözleşmesi imzala', 'توقيع عقد العمل', 'واژۆی کار واژۆ بکە', 'Peymana xebatê îmze bike', 'امضای قرارداد کار', 'Jobangebot von deutschem Arbeitgeber', 'Job offer from German employer', 'Alman işverenden iş teklifi', 'عرض عمل من صاحب عمل ألماني', 'پێشکەشکراوی کار لە خاوەنکارێکی ئەڵمانی', 'Pêşkêşa kar ji xwedîkarê Alman', 'پیشنهاد کار از کارفرمای آلمانی'),
('skilled_worker', 4, 'Blaue Karte EU beantragen', 'Apply for EU Blue Card', 'AB Mavi Kart başvurusu', 'التقدم بطلب للحصول على البطاقة الزرقاء للاتحاد الأوروبي', 'داواکاری کارتی شینی یەکێتی ئەورووپا', 'Ji bo Karta Şîn a EU daxwaz bike', 'درخواست کارت آبی اتحادیه اروپا', 'Bei hohem Gehalt möglich (ab 45.300€)', 'Possible with high salary (from €45,300)', 'Yüksek maaşla mümkün (45.300€'dan)', 'ممكن مع راتب مرتفع (من 45,300 يورو)', 'بە مووچەی بەرز دەتوانرێت (لە ٤٥٬٣٠٠€ەوە)', 'Bi mûçeya bilind pêkan e (ji €45,300)', 'با حقوق بالا امکان پذیر است (از 45,300 یورو)'),
('skilled_worker', 5, 'Familiennachzug vorbereiten', 'Prepare family reunion', 'Aile birleşimi hazırla', 'إعداد لم شمل الأسرة', 'ئامادەکاری کۆبوونەوەی خێزان', 'Yekbûna malbatê amade bike', 'آماده سازی اتحاد خانواده', 'Nach Aufenthaltstitel Familie nachholen', 'Bring family after residence permit', 'Oturma izninden sonra aileyi getir', 'احضر العائلة بعد الحصول على إذن الإقامة', 'دوای مۆڵەتی نیشتەجێبوون خێزان بهێنە', 'Piştî destûra niştecihbûnê malbatê bîne', 'بعد از مجوز اقامت خانواده را بیاورید');

-- Student checklist
INSERT INTO checklist_items (status_type, order_index, title_de, title_en, title_tr, title_ar, title_ku_sorani, title_ku_kurmanji, title_fa, description_de, description_en, description_tr, description_ar, description_ku_sorani, description_ku_kurmanji, description_fa) VALUES
('student', 1, 'Zulassung zur Universität', 'University admission', 'Üniversite kabulü', 'القبول في الجامعة', 'وەرگیراوی زانکۆ', 'Pejirandina zanîngehê', 'پذیرش دانشگاه', 'Zulassungsbescheid von deutscher Hochschule', 'Admission letter from German university', 'Alman üniversitesinden kabul mektubu', 'خطاب القبول من جامعة ألمانية', 'نامەی وەرگیراو لە زانکۆیەکی ئەڵمانی', 'Nameya pejirandinê ji zanîngeha Alman', 'نامه پذیرش از دانشگاه آلمانی'),
('student', 2, 'Finanzierungsnachweis erbringen', 'Provide proof of financing', 'Finansman kanıtı sun', 'تقديم إثبات التمويل', 'بەڵگەی دارایی پێشکەش بکە', 'Delîla fînanskirinê pêşkêş bike', 'ارائه مدرک مالی', 'Sperrkonto mit ca. 11.208€ eröffnen', 'Open blocked account with approx. €11,208', 'Yaklaşık 11.208€ ile bloke hesap açın', 'افتح حساب مقيد بحوالي 11,208 يورو', 'هەژماری داخراو بە نزیکەی ١١٬٢٠٨€ بکەرەوە', 'Hesabê astengkirî bi nêzîkî €11,208 veke', 'حساب مسدود با حدود 11,208 یورو باز کنید'),
('student', 3, 'Studentenvisum beantragen', 'Apply for student visa', 'Öğrenci vizesi başvurusu', 'التقدم بطلب للحصول على تأشيرة طالب', 'داواکاری ڤیزای قوتابی', 'Ji bo vîzaya xwendekar daxwaz bike', 'درخواست ویزای دانشجویی', 'Bei deutscher Botschaft im Heimatland', 'At German embassy in home country', 'Ana ülkedeki Alman büyükelçiliğinde', 'في السفارة الألمانية في بلدك', 'لە باڵیۆزخانەی ئەڵمانیا لە وڵاتی خۆت', 'Li vekşîna Alman li welatê xwe', 'در سفارت آلمان در کشور خود'),
('student', 4, 'Krankenversicherung abschließen', 'Get health insurance', 'Sağlık sigortası yaptır', 'الحصول على تأمين صحي', 'بیمەی تەندروستی دابین بکە', 'Bîmeya tenduristiyê bistîne', 'دریافت بیمه درمانی', 'Gesetzliche studentische Krankenversicherung', 'Public student health insurance', 'Kamu öğrenci sağlık sigortası', 'التأمين الصحي العام للطلاب', 'بیمەی تەندروستی قوتابیانی گشتی', 'Bîmeya tenduristiya xwendekarên giştî', 'بیمه درمانی دانشجویی عمومی'),
('student', 5, 'Nebenjob suchen', 'Find part-time job', 'Yarı zamanlı iş bul', 'البحث عن وظيفة بدوام جزئي', 'کاری کاتی بدۆزەرەوە', 'Karê nîvkate bibîne', 'پیدا کردن کار پاره وقت', 'Studenten dürfen 120 volle oder 240 halbe Tage arbeiten', 'Students may work 120 full or 240 half days', 'Öğrenciler 120 tam veya 240 yarım gün çalışabilir', 'يمكن للطلاب العمل 120 يومًا كاملاً أو 240 نصف يوم', 'قوتابیان دەتوانن ١٢٠ ڕۆژی تەواو یان ٢٤٠ نیوە ڕۆژ کار بکەن', 'Xwendekar dikarin 120 rojên tevahî an 240 nîv rojan xebitin', 'دانشجویان می توانند 120 روز کامل یا 240 نیم روز کار کنند');
