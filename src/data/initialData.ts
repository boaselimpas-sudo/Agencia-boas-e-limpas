import { MenuItem, AgencyConfig, GalleryMediaItem } from '../types.ts';

export const INITIAL_AGENCY_CONFIG: AgencyConfig = {
  name: "Boas e limpas",
  tagline: "Agência Exclusiva de Acompanhantes de Alto Padrão em Moçambique",
  phone1: "864368486",
  phone2: "878872648",
  address: "Av. Julius Nyerere, Polana Cimento, Maputo",
  city: "Maputo - Moçambique",
  operatingHours: "24h / 7 dias por semana (Atendimento Discreto)",
  paymentMethods: ["e-Mola", "M-Pesa", "Dinheiro"],
  heroImage: "", // Ready for user's own real banner photo
  subscriptionPrice: 500, // 500 MZN por mês para acessar o catálogo
  emolaNumber: "864368486", // Linha e-Mola oficial
  emolaName: "Boas e limpas VIP",
};

// Preset exclusive videos for the models
export const PRESET_VIDEOS = [
  {
    id: 'video-1',
    title: 'Apresentação Exclusiva Sheila (Reel VIP)',
    modelName: 'Sheila',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-black-dress-walking-on-a-runway-41221-large.mp4',
    duration: '0:32',
  },
  {
    id: 'video-2',
    title: 'Ensaio Sofisticado Vanessa (Coquetel VIP)',
    modelName: 'Vanessa',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-smiling-at-the-camera-in-a-party-41225-large.mp4',
    duration: '0:28',
  },
  {
    id: 'video-3',
    title: 'Apresentação Noturna Yolanda (Lounge VIP)',
    modelName: 'Yolanda',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-in-a-nightclub-with-neon-lights-41222-large.mp4',
    duration: '0:35',
  },
  {
    id: 'video-4',
    title: 'Sessão Exclusiva Amanda (Studio Look)',
    modelName: 'Amanda',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-glamorous-model-posing-in-a-studio-setting-41223-large.mp4',
    duration: '0:24',
  },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Categoria: Garotas de programa (fotos prontas para o usuário enviar do celular sem IA)
  {
    id: "garota-1",
    name: "Sheila",
    category: "Garotas de programa",
    price: 3500,
    description: "Elegante, simpática e muito atenciosa. Especialista em conversas agradáveis e momentos inesquecíveis com máxima discrição.",
    details: "23 anos · 1.68m · Atendimento em Maputo e Matola",
    image: "", // Sem foto de IA - pronto para foto real do usuário
    badge: "Destaque VIP",
    available: true,
    hasVideo: true,
    videoDuration: "0:32",
    videoUrl: PRESET_VIDEOS[0].url,
  },
  {
    id: "garota-2",
    name: "Vanessa",
    category: "Garotas de programa",
    price: 4000,
    description: "Estilo sofisticado e postura refinada. Ideal para acompanhamento executivo, jantares finos e eventos exclusivos.",
    details: "25 anos · 1.72m · Bilingue (PT / EN)",
    image: "", // Sem foto de IA - pronto para foto real do usuário
    badge: "Top Model",
    available: true,
    hasVideo: true,
    videoDuration: "0:28",
    videoUrl: PRESET_VIDEOS[1].url,
  },
  {
    id: "garota-3",
    name: "Yolanda",
    category: "Garotas de programa",
    price: 3800,
    description: "Carismática, comunicativa e exuberante. Garante atendimento VIP de altíssimo nível, carinho e total privacidade.",
    details: "24 anos · 1.70m · Atendimento VIP",
    image: "", // Sem foto de IA - pronto para foto real do usuário
    badge: "Popular VIP",
    available: true,
    hasVideo: true,
    videoDuration: "0:35",
    videoUrl: PRESET_VIDEOS[2].url,
  },
  {
    id: "garota-4",
    name: "Amanda",
    category: "Garotas de programa",
    price: 3200,
    description: "Doce, carinhosa e discreta. Perfeita para quem busca tranquilidade, privacidade e companhia de alto padrão.",
    details: "22 anos · 1.65m · Costa do Sol",
    image: "", // Sem foto de IA - pronto para foto real do usuário
    badge: "Novo Vídeo",
    available: true,
    hasVideo: true,
    videoDuration: "0:24",
    videoUrl: PRESET_VIDEOS[3].url,
  },

  // Categoria: Serviços & Pacotes (4 itens)
  {
    id: "servico-1",
    name: "Pacote Noite Completa VIP (Pernoite)",
    category: "Serviços & Pacotes",
    price: 12000,
    description: "Acompanhamento exclusivo durante toda a noite com recepção vip, privacidade total e champanhe de cortesia.",
    details: "Até 8 horas de acompanhamento exclusivo",
    badge: "Premium",
    available: true,
  },
  {
    id: "servico-2",
    name: "Acompanhamento Executivo & Jantar",
    category: "Serviços & Pacotes",
    price: 6000,
    description: "Companhia para eventos corporativos, restaurantes requintados ou viagens de negócios com total discrição e elegância.",
    details: "3 a 4 horas em locais públicos ou privados",
    badge: "Corporativo",
    available: true,
  },
  {
    id: "servico-3",
    name: "Atendimento na Suíte da Agência",
    category: "Serviços & Pacotes",
    price: 4500,
    description: "Sessão exclusiva nas dependências privadas da agência Boas e Limpas, com suíte climatizada, bar privativo e estacionamento discreto.",
    details: "Localização nobre em Polana, Maputo",
    badge: "Privado",
    available: true,
  },
  {
    id: "servico-4",
    name: "Sessão Rápida Express (1 Hora)",
    category: "Serviços & Pacotes",
    price: 2500,
    description: "Encontro descontraído para quebrar a rotina com conforto e discrição garantida.",
    details: "60 minutos de atenção personalizada",
    badge: "Express",
    available: true,
  },

  // Categoria: Bebidas & Cortesias VIP (4 itens)
  {
    id: "bebida-1",
    name: "Champagne Moët & Chandon Brut Imperial",
    category: "Bebidas VIP",
    price: 5500,
    description: "Garrafa de champanhe francês de luxo gelada no balde de gelo com duas taças de cristal para brindar o encontro.",
    details: "Garrafa 750ml com balde térmico e taças",
    badge: "Bar VIP",
    available: true,
  },
  {
    id: "bebida-2",
    name: "Whisky Johnnie Walker Black Label 12 Anos",
    category: "Bebidas VIP",
    price: 3200,
    description: "Whisky escocês premium acompanhado de copos on the rocks e pedras de gelo de água mineral.",
    details: "Garrafa 750ml",
    badge: "Bar VIP",
    available: true,
  },
  {
    id: "bebida-3",
    name: "Vinho Tinto Reserva Português Selecionado",
    category: "Bebidas VIP",
    price: 1800,
    description: "Vinho tinto encorpado de grande colheita, servido na temperatura perfeita para o encontro.",
    details: "Garrafa 750ml",
    badge: "Vinho",
    available: true,
  },
  {
    id: "bebida-4",
    name: "Combo Energéticos Red Bull & Águas Premium",
    category: "Bebidas VIP",
    price: 800,
    description: "Pack com 4 Red Bull gelados e 4 águas minerais premium gasosa e natural.",
    details: "Kit refrescante servido gelado",
    badge: "Refrescante",
    available: true,
  },
];

// Initial Site Gallery items (populated by user uploads and demo videos)
export const INITIAL_GALLERY_ITEMS: GalleryMediaItem[] = [
  {
    id: 'gal-vid-1',
    title: 'Apresentação Exclusiva Sheila (Reel VIP)',
    modelName: 'Sheila',
    type: 'video',
    url: PRESET_VIDEOS[0].url,
    duration: '0:32',
    modelId: 'garota-1',
    price: 3500,
  },
  {
    id: 'gal-vid-2',
    title: 'Ensaio Sofisticado Vanessa (Coquetel VIP)',
    modelName: 'Vanessa',
    type: 'video',
    url: PRESET_VIDEOS[1].url,
    duration: '0:28',
    modelId: 'garota-2',
    price: 4000,
  },
  {
    id: 'gal-vid-3',
    title: 'Apresentação Noturna Yolanda (Lounge VIP)',
    modelName: 'Yolanda',
    type: 'video',
    url: PRESET_VIDEOS[2].url,
    duration: '0:35',
    modelId: 'garota-3',
    price: 3800,
  },
  {
    id: 'gal-vid-4',
    title: 'Sessão Exclusiva Amanda (Studio Look)',
    modelName: 'Amanda',
    type: 'video',
    url: PRESET_VIDEOS[3].url,
    duration: '0:24',
    modelId: 'garota-4',
    price: 3200,
  },
];
