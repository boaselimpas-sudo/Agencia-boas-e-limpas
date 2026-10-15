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

];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Categoria: Garotas de programa (fotos prontas para o usuário enviar do celular sem IA)
  {
  
   
    hasVideo: true,
    videoDuration: "0:32",
    videoUrl: PRESET_VIDEOS[0].url,
  },
  {
   
