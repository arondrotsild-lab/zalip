import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter, Link } from 'wouter';
import { Search, Heart, Plus, MapPin, SlidersHorizontal, X, ChevronDown, Sofa, Smartphone, Bike, Shirt, Home as HomeIcon, BriefcaseBusiness, Wrench, Grid2X2, Clock3, ArrowDownUp, Check, Menu, Sparkles } from 'lucide-react';
import chairPhoto from '@/assets/listings/zalip-chair.jpg';
import phonePhoto from '@/assets/listings/zalip-phone-single.jpg';
import bikePhoto from '@/assets/listings/zalip-bike.jpg';
import coatPhoto from '@/assets/listings/zalip-coat.jpg';
import tablePhoto from '@/assets/listings/zalip-table.jpg';
import lampPhoto from '@/assets/listings/zalip-lamp.jpg';
import headphonesPhoto from '@/assets/listings/zalip-headphones.jpg';
import coffeePhoto from '@/assets/listings/zalip-coffee.jpg';
import dresserPhoto from '@/assets/listings/zalip-dresser.jpg';
import jacketPhoto from '@/assets/listings/zalip-jacket.jpg';
import scooterPhoto from '@/assets/listings/zalip-scooter.jpg';
import deskPhoto from '@/assets/listings/zalip-desk.jpg';
import ladaVestaPhoto from '@/assets/listings/zalip-car-lada-vesta.jpg';
import kiaRioPhoto from '@/assets/listings/zalip-car-kia-rio.jpg';
import volkswagenPoloPhoto from '@/assets/listings/zalip-car-volkswagen-polo.jpg';
import toyotaCorollaPhoto from '@/assets/listings/zalip-car-toyota-corolla.jpg';
import renaultDusterPhoto from '@/assets/listings/zalip-car-renault-duster.jpg';
import hondaCb500fPhoto from '@/assets/listings/zalip-moto-honda-cb500f.jpg';
import yamahaMt07Photo from '@/assets/listings/zalip-moto-yamaha-mt07.jpg';
import kawasakiNinja400Photo from '@/assets/listings/zalip-moto-kawasaki-ninja400.jpg';
import suzukiVstrom650Photo from '@/assets/listings/zalip-moto-suzuki-vstrom650.jpg';
import uralSidecarPhoto from '@/assets/listings/zalip-moto-ural-sidecar.jpg';
import hondaPcx160Photo from '@/assets/listings/zalip-scooter-honda-pcx160.jpg';
import yamahaNmax155Photo from '@/assets/listings/zalip-scooter-yamaha-nmax155.jpg';
import vespaPrimaveraPhoto from '@/assets/listings/zalip-scooter-vespa-primavera.jpg';
import symJet14Photo from '@/assets/listings/zalip-scooter-sym-jet14.jpg';
import hondaDioPhoto from '@/assets/listings/zalip-scooter-honda-dio.jpg';
import porsche911Photo from '@/assets/listings/zalip-premium-porsche-911.jpg';
import mercedesSClassPhoto from '@/assets/listings/zalip-premium-mercedes-s-class.jpg';
import bmwM5Photo from '@/assets/listings/zalip-premium-bmw-m5.jpg';
import rangeRoverPhoto from '@/assets/listings/zalip-premium-range-rover.jpg';
import ferrariRomaPhoto from '@/assets/listings/zalip-premium-ferrari-roma.jpg';
import bentleyContinentalPhoto from '@/assets/listings/zalip-premium-bentley-continental.jpg';
import './marketplace.css';

type Listing = {
  id: string; title: string; price: number; city: string; category: string;
  condition: string; seller: string; postedAt: string; image: string;
  isNegotiable: boolean; description: string;
};

const queryClient = new QueryClient();
const RUB_PER_USD = 83.436112;
const CURRENCY_STORAGE_KEY = 'zalip-price-currency';
const CURRENCY_VERSION = 'usd-v1';
const SCOOTER_PRICES_USD: Record<string, number> = {
  'l-211': 1250,
  'l-212': 1350,
  'l-213': 1500,
  'l-214': 1100,
  'l-215': 800,
};
const isScooterImage = (image: string) => image === 'scooter' || image.startsWith('scooter_');
const rublesToDollars = (price: number) => Math.max(1, Math.round(price / RUB_PER_USD));
const initialListings: Listing[] = [
  { id:'l-301', title:'Porsche 911 Carrera 2022, 3.0 · 18 тыс. км', price:22900000, city:'Москва', category:'Транспорт', condition:'Отличное', seller:'Алексей', postedAt:'Сегодня, 15:42', image:'premium_porsche_911', isNegotiable:true, description:'Спортивное купе в отличном состоянии, пробег 18 тыс. км. Полная история обслуживания, бережная эксплуатация и хранение в тёплом паркинге.' },
  { id:'l-302', title:'Mercedes-Benz S 500 4MATIC 2021', price:18500000, city:'Санкт-Петербург', category:'Транспорт', condition:'Отличное', seller:'Виктор', postedAt:'Сегодня, 15:30', image:'premium_mercedes_s_class', isNegotiable:false, description:'Представительский седан, пробег 33 тыс. км. Пневмоподвеска и все системы работают исправно. Обслуживание у официального дилера.' },
  { id:'l-303', title:'BMW M5 Competition 2020, 4.4 · 29 тыс. км', price:14900000, city:'Казань', category:'Транспорт', condition:'Отличное', seller:'Роман', postedAt:'Сегодня, 15:18', image:'premium_bmw_m5', isNegotiable:true, description:'Мощный спортивный седан в ухоженном состоянии. Пробег 29 тыс. км, прозрачная история, два комплекта колёс.' },
  { id:'l-304', title:'Range Rover Autobiography 2021', price:20800000, city:'Екатеринбург', category:'Транспорт', condition:'Отличное', seller:'Олег', postedAt:'Сегодня, 15:06', image:'premium_range_rover', isNegotiable:true, description:'Премиальный внедорожник, пробег 41 тыс. км. Богатая комплектация, салон без повреждений, обслуживание по регламенту.' },
  { id:'l-305', title:'Ferrari Roma 2022, пробег 9 тыс. км', price:31500000, city:'Москва', category:'Транспорт', condition:'Отличное', seller:'Дмитрий', postedAt:'Сегодня, 14:54', image:'premium_ferrari_roma', isNegotiable:false, description:'Элегантное итальянское купе в безупречном состоянии. Пробег 9 тыс. км, автомобиль обслужен и готов к осмотру по предварительной записи.' },
  { id:'l-306', title:'Bentley Continental GT 2020, W12', price:27900000, city:'Самара', category:'Транспорт', condition:'Отличное', seller:'Николай', postedAt:'Сегодня, 14:42', image:'premium_bentley_continental', isNegotiable:true, description:'Комфортабельное купе с двигателем W12, пробег 22 тыс. км. Кузов и салон в отличном состоянии, сервисная история в наличии.' },
  { id:'l-201', title:'Lada Vesta 2019, 1.6 · механика', price:875000, city:'Москва', category:'Транспорт', condition:'Хорошее', seller:'Антон', postedAt:'Сегодня, 14:20', image:'car_lada_vesta', isNegotiable:true, description:'Пробег 92 тыс. км. Двигатель и коробка работают ровно, кондиционер обслужен. Документы в порядке, возможна проверка.' },
  { id:'l-202', title:'Kia Rio 2017, автомат', price:1090000, city:'Санкт-Петербург', category:'Транспорт', condition:'Хорошее', seller:'Марина', postedAt:'Сегодня, 14:05', image:'car_kia_rio', isNegotiable:false, description:'Пробег 115 тыс. км, один владелец в ПТС. Салон ухоженный, есть сервисная история. Осмотр по договорённости.' },
  { id:'l-203', title:'Volkswagen Polo 2020, 1.6 · автомат', price:1450000, city:'Казань', category:'Транспорт', condition:'Отличное', seller:'Сергей', postedAt:'Сегодня, 13:48', image:'car_vw_polo', isNegotiable:true, description:'Пробег 68 тыс. км. Регулярное обслуживание, летняя резина в комплекте. Без срочных вложений.' },
  { id:'l-204', title:'Toyota Corolla 2015, седан', price:1590000, city:'Екатеринбург', category:'Транспорт', condition:'Хорошее', seller:'Вадим', postedAt:'Сегодня, 13:32', image:'car_toyota_corolla', isNegotiable:true, description:'Пробег 142 тыс. км, экономичный двигатель 1.6. Чистый салон, недавно заменены расходники. Торг после осмотра.' },
  { id:'l-205', title:'Renault Duster 2018, 1.6 · механика', price:1600000, city:'Новосибирск', category:'Транспорт', condition:'Хорошее', seller:'Ксения', postedAt:'Сегодня, 13:15', image:'car_renault_duster', isNegotiable:false, description:'Пробег 97 тыс. км. Практичный автомобиль для города и поездок за город. Два комплекта ключей, обслуживание по графику.' },
  { id:'l-206', title:'Honda CB500F 2019, пробег 18 тыс. км', price:515000, city:'Самара', category:'Транспорт', condition:'Отличное', seller:'Евгений', postedAt:'Сегодня, 12:58', image:'moto_honda_cb500f', isNegotiable:true, description:'Надёжный дорожный мотоцикл, сезонное обслуживание пройдено. Пластик целый, резина ещё на сезон. Документы готовы.' },
  { id:'l-207', title:'Yamaha MT-07 2018, пробег 22 тыс. км', price:735000, city:'Москва', category:'Транспорт', condition:'Хорошее', seller:'Артём', postedAt:'Сегодня, 12:41', image:'moto_yamaha_mt07', isNegotiable:false, description:'Лёгкий и манёвренный нейкед. Масло и фильтры заменены перед сезоном, есть небольшие следы эксплуатации.' },
  { id:'l-208', title:'Kawasaki Ninja 400 2020', price:665000, city:'Краснодар', category:'Транспорт', condition:'Отличное', seller:'Михаил', postedAt:'Сегодня, 12:26', image:'moto_kawasaki_ninja400', isNegotiable:true, description:'Спортивный мотоцикл с пробегом 12 тыс. км. Технически исправен, хранился в гараже. Готов к осмотру.' },
  { id:'l-209', title:'Suzuki V-Strom 650 2017, туристический', price:845000, city:'Пермь', category:'Транспорт', condition:'Хорошее', seller:'Денис', postedAt:'Сегодня, 12:09', image:'moto_suzuki_vstrom650', isNegotiable:true, description:'Удобен для дальних поездок, пробег 31 тыс. км. Высокое ветровое стекло, обслуживание без просрочек.' },
  { id:'l-210', title:'Мотоцикл «Урал» с коляской, 2012', price:920000, city:'Нижний Новгород', category:'Транспорт', condition:'Хорошее', seller:'Игорь', postedAt:'Сегодня, 11:52', image:'moto_ural_sidecar', isNegotiable:true, description:'Классический мотоцикл с коляской, пробег 27 тыс. км. На ходу, подходит для неспешных поездок и коллекции.' },
  { id:'l-211', title:'Скутер Honda PCX 160, 2021', price:299000, city:'Санкт-Петербург', category:'Транспорт', condition:'Отличное', seller:'Иван', postedAt:'Сегодня, 11:35', image:'scooter_honda_pcx160', isNegotiable:false, description:'Пробег 8 тыс. км. Экономичный городской скутер, кофр и ветровое стекло в комплекте. Бережная эксплуатация.' },
  { id:'l-212', title:'Скутер Yamaha NMAX 155, 2022', price:365000, city:'Казань', category:'Транспорт', condition:'Отличное', seller:'Полина', postedAt:'Сегодня, 11:18', image:'scooter_yamaha_nmax155', isNegotiable:true, description:'Пробег 4,5 тыс. км, небольшой расход топлива. Все плановые работы выполнены, два ключа.' },
  { id:'l-213', title:'Vespa Primavera 150, 2019', price:590000, city:'Москва', category:'Транспорт', condition:'Хорошее', seller:'Кирилл', postedAt:'Сегодня, 11:01', image:'scooter_vespa_primavera', isNegotiable:true, description:'Классический городской скутер, пробег 11 тыс. км. На ходу, аккуратный внешний вид, документы на руках.' },
  { id:'l-214', title:'Скутер SYM Jet 14 125, 2023', price:245000, city:'Екатеринбург', category:'Транспорт', condition:'Отличное', seller:'Дарья', postedAt:'Сегодня, 10:44', image:'scooter_sym_jet14', isNegotiable:false, description:'Пробег всего 1,8 тыс. км. Удобная ровная площадка для ног, недавно пройдено ТО. Готов к сезону.' },
  { id:'l-215', title:'Скутер Honda Dio 110, 2018', price:135000, city:'Новосибирск', category:'Транспорт', condition:'Хорошее', seller:'Павел', postedAt:'Сегодня, 10:27', image:'scooter_honda_dio', isNegotiable:true, description:'Компактный скутер для города, пробег 15 тыс. км. Экономичный, обслужен, есть небольшие косметические следы.' },
  { id:'l-101', title:'Кресло «Сканди» в отличном состоянии', price:8900, city:'Москва', category:'Для дома', condition:'Отличное', seller:'Мария', postedAt:'Сегодня, 10:42', image:'chair', isNegotiable:true, description:'Уютное кресло в светлой обивке, почти не использовалось. Отдам вместе с декоративной подушкой. Самовывоз у метро Сокол.' },
  { id:'l-102', title:'iPhone 13, 128 ГБ — без царапин', price:38900, city:'Санкт-Петербург', category:'Электроника', condition:'Хорошее', seller:'Илья', postedAt:'Сегодня, 09:18', image:'phone', isNegotiable:false, description:'Телефон полностью исправен, батарея 87%. В комплекте коробка и кабель. Можно проверить при встрече.' },
  { id:'l-103', title:'Велосипед городской, размер M', price:16700, city:'Казань', category:'Транспорт', condition:'Хорошее', seller:'Денис', postedAt:'Вчера, 19:36', image:'bike', isNegotiable:true, description:'Лёгкий городской велосипед, после обслуживания. Передачи переключаются чётко, тормоза новые.' },
  { id:'l-104', title:'Пальто шерстяное, размер 44', price:5400, city:'Москва', category:'Одежда', condition:'Новое', seller:'Алина', postedAt:'Вчера, 16:02', image:'coat', isNegotiable:true, description:'Носила один раз на фотосессию. Мягкая шерсть, красивый графитовый оттенок.' },
  { id:'l-105', title:'Стол обеденный из дуба', price:22400, city:'Екатеринбург', category:'Для дома', condition:'Хорошее', seller:'Павел', postedAt:'Вчера, 13:50', image:'table', isNegotiable:false, description:'Надёжный стол на 4–6 человек. Столешница из массива, есть небольшие следы использования.' },
  { id:'l-106', title:'Настольная лампа с латунным основанием', price:3200, city:'Новосибирск', category:'Для дома', condition:'Отличное', seller:'Ольга', postedAt:'12 июня', image:'lamp', isNegotiable:true, description:'Тёплый свет, регулировка наклона. Хорошо смотрится на рабочем столе или прикроватной тумбе.' },
  { id:'l-107', title:'Наушники Sony WH-1000XM4', price:17900, city:'Москва', category:'Электроника', condition:'Отличное', seller:'Тимур', postedAt:'12 июня', image:'headphones', isNegotiable:false, description:'Оригинальные наушники с шумоподавлением. Бережное использование, амбушюры целые.' },
  { id:'l-108', title:'Кофемашина компактная DeLonghi', price:11800, city:'Самара', category:'Электроника', condition:'Хорошее', seller:'Екатерина', postedAt:'11 июня', image:'coffee', isNegotiable:true, description:'Рабочая кофемашина, регулярно чистилась. В подарок отдам пачку зёрен.' },
  { id:'l-109', title:'Комод винтажный после реставрации', price:14900, city:'Нижний Новгород', category:'Для дома', condition:'Отличное', seller:'Соня', postedAt:'10 июня', image:'dresser', isNegotiable:true, description:'Аккуратно обновлён, ящики выдвигаются легко. Небольшой, но очень вместительный.' },
  { id:'l-110', title:'Куртка лёгкая демисезонная', price:4600, city:'Пермь', category:'Одежда', condition:'Отличное', seller:'Вера', postedAt:'9 июня', image:'jacket', isNegotiable:false, description:'Размер 46, удобная посадка и глубокие карманы. Цвет тёмно-синий.' },
  { id:'l-111', title:'Самокат для города, складной', price:7200, city:'Краснодар', category:'Транспорт', condition:'Хорошее', seller:'Максим', postedAt:'8 июня', image:'scooter', isNegotiable:true, description:'Лёгкий, складывается одним движением. Колёса в хорошем состоянии.' },
  { id:'l-112', title:'Рабочий стол с ящиками', price:6300, city:'Москва', category:'Для дома', condition:'Хорошее', seller:'Никита', postedAt:'7 июня', image:'desk', isNegotiable:true, description:'Удобный стол для учёбы или работы. Самовывоз, помогу спустить до машины.' },
].map((listing) => ({
  ...listing,
  city: 'Алания',
  price: SCOOTER_PRICES_USD[listing.id] ?? rublesToDollars(listing.price),
}));
const categories = ['Все объявления','Для дома','Электроника','Транспорт','Одежда','Работа','Услуги'];
const cities = ['Все города','Алания'];
const art: Record<string, {bg:string; fg:string; label:string; icon: typeof Sofa}> = {
  chair:{bg:'linear-gradient(145deg,#e3ccad,#bd8e69)',fg:'#593c2e',label:'HOME / 01',icon:Sofa},
  phone:{bg:'linear-gradient(145deg,#c6d4c8,#708d7c)',fg:'#183b33',label:'TECH / 13',icon:Smartphone},
  bike:{bg:'linear-gradient(145deg,#ebd5a9,#c79b53)',fg:'#533c1e',label:'CITY / 02',icon:Bike},
  coat:{bg:'linear-gradient(145deg,#dfc7c3,#a77570)',fg:'#4d2b2b',label:'ATELIER / 04',icon:Shirt},
  table:{bg:'linear-gradient(145deg,#d5c8ad,#9d8663)',fg:'#423a2c',label:'WOOD / 05',icon:HomeIcon},
  lamp:{bg:'linear-gradient(145deg,#e9d9aa,#bda467)',fg:'#5e4921',label:'LIGHT / 03',icon:HomeIcon},
  headphones:{bg:'linear-gradient(145deg,#c8d0d0,#76898c)',fg:'#27383a',label:'SOUND / 04',icon:Smartphone},
  coffee:{bg:'linear-gradient(145deg,#e5c4a8,#b57e5e)',fg:'#553528',label:'MORNING / 08',icon:HomeIcon},
  dresser:{bg:'linear-gradient(145deg,#d7c2a6,#9e7958)',fg:'#4b3729',label:'FOUND / 09',icon:HomeIcon},
  jacket:{bg:'linear-gradient(145deg,#c3ccd5,#798999)',fg:'#263749',label:'DAILY / 10',icon:Shirt},
  scooter:{bg:'linear-gradient(145deg,#d2d9bd,#909c6e)',fg:'#3a452c',label:'MOVE / 11',icon:Bike},
  desk:{bg:'linear-gradient(145deg,#d7cbb6,#a18d6f)',fg:'#4d4334',label:'STUDY / 12',icon:HomeIcon},
};
const listingPhotos: Record<string, string> = {
  chair: chairPhoto, phone: phonePhoto, bike: bikePhoto, coat: coatPhoto,
  table: tablePhoto, lamp: lampPhoto, headphones: headphonesPhoto, coffee: coffeePhoto,
  dresser: dresserPhoto, jacket: jacketPhoto, scooter: scooterPhoto, desk: deskPhoto,
  car_lada_vesta: ladaVestaPhoto, car_kia_rio: kiaRioPhoto, car_vw_polo: volkswagenPoloPhoto,
  car_toyota_corolla: toyotaCorollaPhoto, car_renault_duster: renaultDusterPhoto,
  moto_honda_cb500f: hondaCb500fPhoto, moto_yamaha_mt07: yamahaMt07Photo,
  moto_kawasaki_ninja400: kawasakiNinja400Photo, moto_suzuki_vstrom650: suzukiVstrom650Photo,
  moto_ural_sidecar: uralSidecarPhoto, scooter_honda_pcx160: hondaPcx160Photo,
  scooter_yamaha_nmax155: yamahaNmax155Photo, scooter_vespa_primavera: vespaPrimaveraPhoto,
  scooter_sym_jet14: symJet14Photo, scooter_honda_dio: hondaDioPhoto,
  premium_porsche_911: porsche911Photo, premium_mercedes_s_class: mercedesSClassPhoto,
  premium_bmw_m5: bmwM5Photo, premium_range_rover: rangeRoverPhoto,
  premium_ferrari_roma: ferrariRomaPhoto, premium_bentley_continental: bentleyContinentalPhoto,
};
if (new Set(Object.values(listingPhotos)).size !== Object.keys(listingPhotos).length) {
  throw new Error('Each ZALIP listing type must use a unique photo.');
}
if (new Set(initialListings.map((listing) => listing.image)).size !== initialListings.length) {
  throw new Error('Each demo listing must use a different photo.');
}
const readLocal = <T,>(key:string, fallback:T):T => { try { const val=localStorage.getItem(key); return val ? JSON.parse(val) as T : fallback; } catch { return fallback; } };
const loadListings = (): Listing[] => {
  const saved = readLocal<Listing[] | null>('zalip-listings', null);
  const savedPricesAreUsd = localStorage.getItem(CURRENCY_STORAGE_KEY) === CURRENCY_VERSION;
  const normalizedSaved = Array.isArray(saved)
    ? saved.map((listing) => {
        let price = savedPricesAreUsd ? listing.price : rublesToDollars(listing.price);
        if (!savedPricesAreUsd) price = SCOOTER_PRICES_USD[listing.id] ?? price;
        if (isScooterImage(listing.image)) price = Math.min(price, 1500);
        return { ...listing, city: 'Алания', price };
      })
    : [];
  const savedIds = new Set(normalizedSaved.map((item) => item.id));
  const normalized = [
    ...initialListings.filter((item) => !savedIds.has(item.id)),
    ...normalizedSaved,
  ];
  localStorage.setItem('zalip-listings', JSON.stringify(normalized));
  localStorage.setItem(CURRENCY_STORAGE_KEY, CURRENCY_VERSION);
  return normalized;
};
const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const money = (n:number) => usdFormatter.format(n);
const shuffleIds = (ids:string[]) => {
  const shuffled = [...ids];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
};

function ArtBlock({ listing, compact=false }: {listing:Listing; compact?:boolean}) {
  const photo = listingPhotos[listing.image];
  if (!photo) throw new Error(`No photo configured for listing type "${listing.image}".`);
  return <div className={`market-photo ${compact?'market-photo-compact':''}`} data-testid={`img-listing-${listing.id}`}>
    <img src={photo} alt={listing.title} loading="lazy" />
    <span className="photo-condition">{listing.condition}</span>
  </div>;
}

function App() {
  const [path, setPath] = useLocation();
  const [listings,setListings]=useState<Listing[]>(loadListings);
  const [randomOrder,setRandomOrder]=useState<string[]>(()=>shuffleIds(listings.map((item)=>item.id)));
  const [favorites,setFavorites]=useState<string[]>(()=>readLocal('zalip-favorites',[]));
  const [query,setQuery]=useState('');
  const [city,setCity]=useState('Алания');
  const [category,setCategory]=useState('Все объявления');
  const [sort,setSort]=useState('random');
  const [detail,setDetail]=useState<Listing|null>(null);
  const [showForm,setShowForm]=useState(false);
  const [mobileMenu,setMobileMenu]=useState(false);
  const favoritePage=path==='/favorites';

  const setFav=(id:string)=>setFavorites(old=>{const next=old.includes(id)?old.filter(x=>x!==id):[...old,id];localStorage.setItem('zalip-favorites',JSON.stringify(next));return next;});
  const shown=useMemo(()=>{
    let rows=listings.filter(item=>(!favoritePage||favorites.includes(item.id))&&(category==='Все объявления'||item.category===category)&&(city==='Все города'||item.city===city)&&(!query||`${item.title} ${item.category} ${item.city} ${item.description}`.toLowerCase().includes(query.toLowerCase())));
    if(sort==='random') {
      const rank=new Map(randomOrder.map((id,index)=>[id,index]));
      rows=[...rows].sort((a,b)=>(rank.get(a.id)??listings.length)-(rank.get(b.id)??listings.length));
    }
    if(sort==='cheap') rows=[...rows].sort((a,b)=>a.price-b.price);
    if(sort==='expensive') rows=[...rows].sort((a,b)=>b.price-a.price);
    return rows;
  },[listings,randomOrder,favorites,favoritePage,category,city,query,sort]);
  const addListing=(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault(); const data=new FormData(event.currentTarget);
    const title=String(data.get('title')||'').trim(); const price=Number(data.get('price'));
    const image=String(data.get('image'));
    const priceField=event.currentTarget.elements.namedItem('price');
    if(priceField instanceof HTMLInputElement) priceField.setCustomValidity('');
    if(!title||!price) return;
    if(isScooterImage(image)&&price>1500) {
      if(priceField instanceof HTMLInputElement) {
        priceField.setCustomValidity('Цена скутера не может превышать $1,500.');
        priceField.reportValidity();
      }
      return;
    }
    const item:Listing={id:`u-${Date.now()}`,title,price,city:String(data.get('city')),category:String(data.get('category')),condition:String(data.get('condition')),seller:String(data.get('seller')||'Вы'),postedAt:'Только что',image,isNegotiable:data.get('negotiable')==='on',description:String(data.get('description')||'Описание не добавлено.')};
    const next=[item,...listings];setListings(next);setRandomOrder(current=>shuffleIds([...current,item.id]));localStorage.setItem('zalip-listings',JSON.stringify(next));setShowForm(false);setCategory('Все объявления');setCity('Алания');setQuery('');setPath('/');
  };

  const categoryIcon=(name:string)=>name==='Для дома'?<Sofa size={16}/>:name==='Электроника'?<Smartphone size={16}/>:name==='Транспорт'?<Bike size={16}/>:name==='Одежда'?<Shirt size={16}/>:name==='Работа'?<BriefcaseBusiness size={16}/>:name==='Услуги'?<Wrench size={16}/>:<Grid2X2 size={16}/>;
  const resetFilters=()=>{setQuery('');setCity('Алания');setCategory('Все объявления');};
  return <div className="market-shell marketplace-page text-[#26323a]">
    <header className="market-header sticky top-0 z-30 border-b border-[#e8e1d5]">
      <div className="mx-auto flex h-[72px] max-w-[1320px] items-center gap-5 px-4 sm:px-7">
        <button className="mr-1 rounded-lg p-2 md:hidden" aria-label="Открыть меню" onClick={()=>setMobileMenu(!mobileMenu)} data-testid="button-mobile-menu"><Menu size={20}/></button>
        <Link href="/" className="zalip-wordmark flex shrink-0 items-center text-[24px] font-bold text-[#e15d3e]" data-testid="link-logo">ZALIP<span className="ml-1 mt-3 block h-2 w-2 rounded-full bg-[#26323a]"/></Link>
        <div className="hidden text-[11px] font-semibold leading-tight tracking-wide text-[#778079] lg:block">НАШЁЛ —<br/>ЗАБРАЛ</div>
        <div className="ml-auto flex w-full max-w-[660px] items-center rounded-xl border border-[#ded8cd] bg-[#fffefa] px-3 py-1.5 shadow-[0_2px_8px_rgba(60,55,46,.03)]">
          <Search size={18} className="shrink-0 text-[#78817e]"/>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Что ищем?" className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[#9a9e98]" data-testid="input-search"/>
          <div className="hidden h-7 w-px bg-[#e4ded2] sm:block"/>
          <MapPin size={16} className="ml-3 hidden shrink-0 text-[#e15d3e] sm:block"/>
          <select value={city} onChange={e=>setCity(e.target.value)} className="hidden max-w-[145px] cursor-pointer bg-transparent px-2 py-2 text-xs font-semibold outline-none sm:block" data-testid="select-city">{cities.map(c=><option key={c}>{c}</option>)}</select>
        </div>
        <button onClick={()=>setShowForm(true)} className="hidden shrink-0 items-center gap-2 rounded-xl bg-[#e15d3e] px-4 py-3 text-sm font-bold text-[#fff8ef] shadow-[0_5px_12px_rgba(206,83,53,.18)] transition hover:bg-[#cf5034] sm:flex" data-testid="button-add-listing"><Plus size={17}/>Подать объявление</button>
        <Link href="/favorites" className={`relative hidden h-11 w-11 items-center justify-center rounded-xl border transition sm:flex ${favoritePage?'border-[#f1c6b7] bg-[#fbebe5] text-[#da593b]':'border-[#e7e1d7] bg-[#fffefa] text-[#4d5856] hover:text-[#e15d3e]'}`} aria-label="Избранное" data-testid="link-favorites"><Heart size={19} fill={favoritePage?'currentColor':'none'}/>{favorites.length>0&&<span className="absolute -right-1 -top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#26323a] px-1 text-[9px] font-bold text-white" data-testid="text-favorite-count">{favorites.length}</span>}</Link>
      </div>
      <div className="category-strip mx-auto flex max-w-[1320px] items-center gap-2 overflow-x-auto px-4 pb-3 sm:px-7 md:gap-5">
        <button onClick={resetFilters} className={`category-link ${category==='Все объявления'?'is-active':''}`} data-testid="button-all-categories">Все объявления</button>
        {categories.slice(1).map(cat=><button key={cat} onClick={()=>setCategory(category===cat?'Все объявления':cat)} className={`category-link ${category===cat?'is-active':''}`} data-testid={`button-category-${cat}`}>{categoryIcon(cat)}{cat}</button>)}
        <span className="ml-auto hidden shrink-0 items-center gap-1 text-[11px] font-semibold text-[#8a918c] lg:flex"><MapPin size={13}/> Турция</span>
      </div>
      {mobileMenu&&<div className="border-t border-[#e8e1d5] bg-[#faf8f2] px-4 py-3 sm:hidden">
        <label className="mb-3 block text-xs font-bold text-[#737b76]">ГОРОД</label><select value={city} onChange={e=>setCity(e.target.value)} className="mb-3 w-full rounded-lg border border-[#ddd6ca] bg-white p-3 text-sm" data-testid="select-city-mobile">{cities.map(c=><option key={c}>{c}</option>)}</select>
        <Link href="/favorites" onClick={()=>setMobileMenu(false)} className="flex items-center gap-2 py-2 text-sm font-semibold" data-testid="link-favorites-mobile"><Heart size={17}/>Избранное ({favorites.length})</Link>
        <button onClick={()=>{setShowForm(true);setMobileMenu(false)}} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#e15d3e] p-3 font-bold text-white" data-testid="button-add-mobile"><Plus size={17}/>Подать объявление</button>
      </div>}
    </header>
    <main className="mx-auto max-w-[1360px] px-4 pb-24 pt-5 sm:px-7 sm:pb-14 sm:pt-7">
      <section className="market-place-heading mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-extrabold tracking-[.13em] text-[#e15d3e]"><Sparkles size={13}/>ЧТО-ТО ХОРОШЕЕ РЯДОМ</div>
          <h1 className="text-[26px] font-extrabold leading-tight tracking-[-.045em] sm:text-[32px]" data-testid="text-hero-title">{favoritePage?'Избранное':'Объявления рядом'}</h1>
          <p className="mt-1 text-sm text-[#747d76]">Покупайте и продавайте в Алании</p>
        </div>
        <div className="market-city-pill flex items-center gap-2 rounded-xl border border-[#e6dfd4] bg-[#fffefa] px-3.5 py-2.5 text-xs font-bold text-[#4c5a53] sm:hidden"><MapPin size={15} className="text-[#df6749]"/>{city==='Все города'?'Все города':city}<ChevronDown size={14}/></div>
        <div className="hidden items-center gap-2 sm:flex">
          <div className="market-updated rounded-xl border border-[#e6dfd4] bg-[#fffefa] px-3.5 py-2.5 text-xs font-semibold text-[#5d6961]"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#69a27a]"/>Объявления обновляются каждый день</div>
          <button onClick={()=>setShowForm(true)} className="market-heading-add flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-extrabold" data-testid="button-hero-add"><Plus size={15}/>Разместить</button>
        </div>
      </section>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {categories.map(item=><button key={item} onClick={()=>setCategory(item)} className={`market-chip whitespace-nowrap rounded-full border px-3.5 py-2 text-[11px] font-bold ${category===item?'border-[#293b35] bg-[#293b35] text-[#fffaf0]':'border-[#e1dbd0] bg-[#fffefa] text-[#626d66]'}`} data-testid={item==='Все объявления'?'button-all-categories':`button-category-${item}`}>{item}</button>)}
      </div>
      <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1 md:hidden">
        {cities.slice(0,5).map(item=><button key={item} onClick={()=>setCity(item)} className={`whitespace-nowrap rounded-full border px-3 py-2 text-[10px] font-bold ${city===item?'border-[#293b35] bg-[#293b35] text-[#fffaf0]':'border-[#e1dbd0] bg-[#fffefa] text-[#626d66]'}`} data-testid={`chip-city-${item}`}>{item}</button>)}
      </div>

      <div className="market-layout">
        <aside className="market-sidebar hidden lg:block">
          <div className="sidebar-panel">
            <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-extrabold">Категории</h2><SlidersHorizontal size={15} className="text-[#8c928b]"/></div>
            <nav className="space-y-0.5">
              {categories.map(item=><button key={item} onClick={()=>setCategory(item)} className={`sidebar-category ${category===item?'selected':''}`} data-testid={item==='Все объявления'?'sidebar-all-categories':`sidebar-category-${item}`}>{categoryIcon(item)}<span>{item}</span>{category===item&&<span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#e15d3e]"/>}</button>)}
            </nav>
            <div className="my-4 border-t border-[#eee9e0]"/>
            <label className="mb-2 block text-[10px] font-extrabold tracking-[.12em] text-[#858d85]">ГОРОД</label>
            <div className="relative">
              <MapPin size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#d76a4f]"/>
              <select value={city} onChange={event=>setCity(event.target.value)} className="w-full appearance-none rounded-lg border border-[#e4ded3] bg-[#fffefa] py-2.5 pl-9 pr-8 text-xs font-bold text-[#48564f] outline-none focus:border-[#d98068]" data-testid="select-city-sidebar">{cities.map(item=><option key={item}>{item}</option>)}</select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#858d85]"/>
            </div>
            <div className="mt-4 rounded-xl bg-[#f1eee5] p-3"><div className="text-[10px] font-extrabold tracking-[.1em] text-[#80887f]">НА ZALIP</div><p className="mt-1.5 text-xs leading-5 text-[#657168]">Удобные вещи и услуги от людей поблизости.</p></div>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-[17px] font-extrabold tracking-[-.025em]" data-testid="text-section-title">{favoritePage?'Сохранённые объявления':category==='Все объявления'?'Свежие объявления':category}</h2>
              <p className="mt-0.5 text-[11px] text-[#858c85]" data-testid="text-results-count">{shown.length} {shown.length===1?'объявление':'объявлений'} · рядом с вами</p>
            </div>
            <div className="flex items-center justify-between gap-2 sm:justify-end">
              <button onClick={resetFilters} className="flex items-center gap-1.5 rounded-lg border border-[#e5dfd4] bg-[#fffefa] px-3 py-2.5 text-[11px] font-bold text-[#68736d] sm:hidden" data-testid="button-reset-filters"><SlidersHorizontal size={14}/>Сбросить</button>
              <label className="market-sort flex items-center gap-2 rounded-lg border border-[#e5dfd4] bg-[#fffefa] px-3 py-2.5 text-[#77817b]"><ArrowDownUp size={14}/><select value={sort} onChange={event=>setSort(event.target.value)} className="cursor-pointer bg-transparent text-[11px] font-bold text-[#47544f] outline-none" data-testid="select-sort"><option value="random">В случайном порядке</option><option value="new">Сначала новые</option><option value="cheap">Сначала дешевле</option><option value="expensive">Сначала дороже</option></select><ChevronDown size={12}/></label>
            </div>
          </div>

          <div className="market-listings">
            {shown.map((item,index)=><article key={item.id} className="market-listing fade-up group" style={{animationDelay:`${Math.min(index,8)*28}ms`}} onClick={()=>setDetail(item)} data-testid={`card-listing-${item.id}`}>
              <div className="relative">
                <ArtBlock listing={item}/>
                <button aria-label={favorites.includes(item.id)?'Убрать из избранного':'В избранное'} onClick={event=>{event.stopPropagation();setFav(item.id);}} className={`market-favorite absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full transition ${favorites.includes(item.id)?'is-favorite':''}`} data-testid={`button-favorite-${item.id}`}><Heart size={17} fill={favorites.includes(item.id)?'currentColor':'none'}/></button>
                {item.isNegotiable&&<span className="negotiable-tag absolute bottom-2.5 left-2.5 rounded-md px-2 py-1 text-[9px] font-bold">Торг уместен</span>}
              </div>
              <div className="market-listing-copy">
                <h3 className="market-listing-title line-clamp-2 text-[13px] font-semibold leading-[1.45] text-[#334039]" data-testid={`text-title-${item.id}`}>{item.title}</h3>
                <div className="mt-1.5 flex items-baseline gap-2"><span className="market-price text-[18px] font-extrabold tracking-[-.04em]" data-testid={`text-price-${item.id}`}>{money(item.price)}</span>{item.isNegotiable&&<span className="text-[10px] font-semibold text-[#90978f]">торг</span>}</div>
                <div className="market-card-meta mt-2.5 flex items-center justify-between gap-2 border-t border-[#f0ece4] pt-2 text-[10px] font-medium text-[#838b84]"><span className="flex min-w-0 items-center gap-1 truncate"><MapPin size={12} className="shrink-0 text-[#d9755b]"/>{item.city}</span><span className="shrink-0">{item.postedAt}</span></div>
              </div>
            </article>)}
          </div>

          {shown.length===0&&<div className="market-empty flex min-h-[310px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#d9d2c6] px-5 text-center" data-testid="state-empty">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f2e9df] text-[#d96a4b]">{favoritePage?<Heart size={23}/>:<Search size={23}/>}</div>
            <h3 className="text-lg font-extrabold tracking-tight">{favoritePage?'Пока ничего не отложили':'По вашему запросу ничего не нашлось'}</h3>
            <p className="mt-2 max-w-[340px] text-sm leading-6 text-[#7b857f]">{favoritePage?'Сохраняйте объявления сердцем — они будут ждать вас здесь.':'Попробуйте изменить запрос или снять пару фильтров.'}</p>
            <button onClick={resetFilters} className="mt-5 rounded-lg border border-[#dcd5c9] bg-[#fffefa] px-4 py-2.5 text-xs font-bold" data-testid="button-clear-search">Сбросить фильтры</button>
          </div>}
        </section>
      </div>

      <footer className="mt-12 flex flex-col gap-3 border-t border-[#e5dfd4] pt-5 text-[11px] font-semibold text-[#858b84] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2"><span className="zalip-wordmark text-[15px] text-[#d95638]">ZALIP</span><span>Объявления, которые находят друг друга.</span></div><span>Демо-маркетплейс · Сделано для Турции</span>
      </footer>
    </main>
    <div className="market-mobile-nav fixed bottom-3 left-3 right-3 z-20 flex rounded-2xl border p-1.5 sm:hidden">
      <Link href="/" className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-bold ${!favoritePage?'text-[#d95638]':'text-[#79817b]'}`} data-testid="mobile-nav-home"><Grid2X2 size={18}/>Объявления</Link>
      <Link href="/favorites" className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-bold ${favoritePage?'text-[#d95638]':'text-[#79817b]'}`} data-testid="mobile-nav-favorites"><Heart size={18}/>Избранное</Link>
      <button onClick={()=>setShowForm(true)} className="flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-bold text-[#79817b]" data-testid="mobile-nav-add"><Plus size={18}/>Разместить</button>
    </div>
    {detail&&<div className="market-overlay fixed inset-0 z-50 flex items-end justify-center bg-[#17211ecc] p-0 backdrop-blur-[3px] sm:items-center sm:p-5" onMouseDown={e=>{if(e.target===e.currentTarget)setDetail(null)}} data-testid="dialog-listing">
      <div className="market-dialog relative max-h-[92dvh] w-full max-w-[760px] overflow-y-auto rounded-t-[24px] bg-[#faf8f2] sm:rounded-[24px]">
        <button onClick={()=>setDetail(null)} className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#fffefa] shadow-sm" aria-label="Закрыть" data-testid="button-close-details"><X size={18}/></button>
        <div className="grid sm:grid-cols-[.95fr_1.05fr]"><div className="detail-photo"><ArtBlock listing={detail}/></div><div className="p-5 sm:p-7">
          <div className="text-[10px] font-extrabold tracking-[.18em] text-[#d95638]">{detail.category} · {detail.condition}</div>
          <h2 className="mt-2 text-[24px] font-extrabold leading-tight tracking-[-.04em]" data-testid="text-detail-title">{detail.title}</h2>
          <div className="mt-3 flex items-baseline gap-2"><span className="text-[27px] font-extrabold tracking-[-.05em]" data-testid="text-detail-price">{money(detail.price)}</span>{detail.isNegotiable&&<span className="text-xs font-semibold text-[#818a83]">возможен торг</span>}</div>
          <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#66726b]"><MapPin size={16} className="text-[#dc765c]"/>{detail.city}<span className="mx-1 text-[#c3bdb2]">·</span><Clock3 size={14}/>{detail.postedAt}</div>
          <div className="my-5 border-t border-[#e8e1d6]"/>
          <div className="text-[10px] font-extrabold tracking-[.16em] text-[#879087]">ОБ ОБЪЯВЛЕНИИ</div>
          <p className="mt-2 text-sm leading-6 text-[#515e58]" data-testid="text-detail-description">{detail.description}</p>
          <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#eeece3] p-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d5e0d4] text-sm font-extrabold text-[#41614e]">{detail.seller.slice(0,1)}</div><div><div className="text-sm font-bold">{detail.seller}</div><div className="mt-0.5 text-[10px] font-semibold text-[#879087]">На ZALIP недавно</div></div><div className="ml-auto rounded-full bg-[#f7f5ed] px-2.5 py-1 text-[9px] font-bold text-[#66746a]">ЧАСТНОЕ ЛИЦО</div></div>
          <button onClick={()=>setFav(detail.id)} className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-extrabold transition ${favorites.includes(detail.id)?'border-[#f0c6b8] bg-[#faeae4] text-[#d95638]':'border-[#e2d9cb] bg-[#fffefa] text-[#394843]'}`} data-testid="button-detail-favorite"><Heart size={17} fill={favorites.includes(detail.id)?'currentColor':'none'}/>{favorites.includes(detail.id)?'Сохранено':'Сохранить в избранное'}</button>
        </div></div>
      </div>
    </div>}
    {showForm&&<div className="market-overlay fixed inset-0 z-50 flex items-end justify-center bg-[#17211ecc] p-0 backdrop-blur-[3px] sm:items-center sm:p-5" onMouseDown={e=>{if(e.target===e.currentTarget)setShowForm(false)}} data-testid="dialog-add-listing">
      <form onSubmit={addListing} className="market-dialog relative max-h-[94dvh] w-full max-w-[590px] overflow-y-auto rounded-t-[24px] bg-[#faf8f2] p-5 sm:rounded-[24px] sm:p-7">
        <button type="button" onClick={()=>setShowForm(false)} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#eeece3]" aria-label="Закрыть форму" data-testid="button-close-form"><X size={18}/></button>
        <div className="text-[10px] font-extrabold tracking-[.2em] text-[#d95638]">ПУСТЬ НАЙДЁТСЯ СВОЙ ЧЕЛОВЕК</div>
        <h2 className="mt-2 text-[25px] font-extrabold tracking-[-.045em]">Новое объявление</h2>
        <p className="mt-1 text-sm text-[#818980]">Заполните самое важное — остальное можно рассказать при встрече.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-bold">Название объявления</span><input required name="title" maxLength={80} placeholder="Например, удобное кресло для чтения" className="w-full rounded-xl border border-[#ddd6cb] bg-[#fffefa] px-3.5 py-3 text-sm outline-none focus:border-[#dc7458]" data-testid="input-listing-title"/></label>
          <label><span className="mb-1.5 block text-xs font-bold">Цена, $</span><input required min="1" type="number" name="price" placeholder="500" className="w-full rounded-xl border border-[#ddd6cb] bg-[#fffefa] px-3.5 py-3 text-sm outline-none focus:border-[#dc7458]" data-testid="input-listing-price"/></label>
          <label><span className="mb-1.5 block text-xs font-bold">Город</span><select name="city" className="w-full rounded-xl border border-[#ddd6cb] bg-[#fffefa] px-3.5 py-3 text-sm outline-none" data-testid="input-listing-city">{cities.slice(1).map(c=><option key={c}>{c}</option>)}</select></label>
          <label><span className="mb-1.5 block text-xs font-bold">Категория</span><select name="category" className="w-full rounded-xl border border-[#ddd6cb] bg-[#fffefa] px-3.5 py-3 text-sm outline-none" data-testid="input-listing-category">{categories.slice(1).map(c=><option key={c}>{c}</option>)}</select></label>
          <label><span className="mb-1.5 block text-xs font-bold">Состояние</span><select name="condition" className="w-full rounded-xl border border-[#ddd6cb] bg-[#fffefa] px-3.5 py-3 text-sm outline-none" data-testid="input-listing-condition"><option>Отличное</option><option>Хорошее</option><option>Новое</option><option>Есть нюансы</option></select></label>
          <label><span className="mb-1.5 block text-xs font-bold">Ваше имя</span><input name="seller" placeholder="Как к вам обращаться" className="w-full rounded-xl border border-[#ddd6cb] bg-[#fffefa] px-3.5 py-3 text-sm outline-none focus:border-[#dc7458]" data-testid="input-listing-seller"/></label>
          <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-bold">Описание</span><textarea name="description" rows={3} placeholder="Расскажите о вещи, состоянии и удобном способе передачи" className="w-full resize-y rounded-xl border border-[#ddd6cb] bg-[#fffefa] px-3.5 py-3 text-sm outline-none focus:border-[#dc7458]" data-testid="input-listing-description"/></label>
          <label><span className="mb-1.5 block text-xs font-bold">Иллюстрация</span><select name="image" className="w-full rounded-xl border border-[#ddd6cb] bg-[#fffefa] px-3.5 py-3 text-sm outline-none" data-testid="input-listing-image">{Object.keys(art).map(key=><option key={key} value={key}>{({chair:'Кресло',phone:'Телефон',bike:'Велосипед',coat:'Одежда',table:'Стол',lamp:'Лампа',headphones:'Наушники',coffee:'Кофемашина',dresser:'Комод',jacket:'Куртка',scooter:'Самокат',desk:'Рабочий стол'} as Record<string,string>)[key]}</option>)}</select></label>
          <label className="flex items-center gap-2 self-end pb-3 text-xs font-bold"><input type="checkbox" name="negotiable" className="h-4 w-4 accent-[#df6244]" data-testid="input-listing-negotiable"/>Готов(а) обсудить цену</label>
        </div>
        <button type="submit" className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#e15d3e] px-4 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#cf5034]" data-testid="button-submit-listing"><Check size={17}/>Опубликовать объявление</button>
        <p className="mt-3 text-center text-[10px] leading-4 text-[#939991]">Демо-объявление сохранится в этом браузере.</p>
      </form>
    </div>}
  </div>;
}

function RoutedErrorBoundary({children}:{children:ReactNode}) {
  const [location]=useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={App}/><Route path="/favorites" component={App}/><Route component={NotFound}/></Switch></RoutedErrorBoundary>;
}

function Root() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/,'')}><Router/></WouterRouter><Toaster/></TooltipProvider></QueryClientProvider>;
}

export default Root;