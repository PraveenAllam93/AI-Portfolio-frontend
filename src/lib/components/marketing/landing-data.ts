import tplMarketing from '$lib/assets/landing/template-marketing.jpg';
import tplDesign from '$lib/assets/landing/template-design.jpg';
import tplArchitecture from '$lib/assets/landing/template-architecture.jpg';
import tplStudent from '$lib/assets/landing/template-student.jpg';
import tplPhotographer from '$lib/assets/landing/template-photographer.jpg';
import tplEngineer from '$lib/assets/landing/template-engineer.jpg';
import tplData from '$lib/assets/landing/template-data.jpg';
import tplWriter from '$lib/assets/landing/template-writer.jpg';
import tplFilm from '$lib/assets/landing/template-film.jpg';
import tplConsultant from '$lib/assets/landing/template-consultant.jpg';
import tplCeo from '$lib/assets/landing/template-ceo.jpg';
import tplCto from '$lib/assets/landing/template-cto.jpg';
import tplAi from '$lib/assets/landing/template-ai.jpg';
import tplMle from '$lib/assets/landing/template-mle.jpg';
import tplSurgeon from '$lib/assets/landing/template-surgeon.jpg';
import tplBanker from '$lib/assets/landing/template-banker.jpg';
import tplBlockchain from '$lib/assets/landing/template-blockchain.jpg';
import tplCloud from '$lib/assets/landing/template-cloud.jpg';

export interface LandingTemplate {
	img: string;
	name: string;
	profession: string;
	color: string;
	tags: string[];
}

export const TEMPLATES: LandingTemplate[] = [
	{ img: tplMarketing, name: 'Bold Marketer', profession: 'Marketing', color: '#ff5c3a', tags: ['KPIs', 'Campaigns'] },
	{ img: tplDesign, name: 'Process First', profession: 'Product Design', color: '#5b3fd4', tags: ['Case Studies', 'App Flows'] },
	{ img: tplArchitecture, name: 'Editorial Build', profession: 'Architecture', color: '#c07a00', tags: ['Renders', 'Floor Plans'] },
	{ img: tplStudent, name: 'Fresh Start', profession: 'Students', color: '#008a67', tags: ['Coursework', 'Internships'] },
	{ img: tplPhotographer, name: 'Dark Gallery', profession: 'Photographer', color: '#1a1a1a', tags: ['Grid', 'Series'] },
	{ img: tplEngineer, name: 'Code & Ship', profession: 'Engineering', color: '#00c896', tags: ['Repos', 'Projects'] },
	{ img: tplData, name: 'Signal & Charts', profession: 'Data Science', color: '#3a8dff', tags: ['Models', 'Dashboards'] },
	{ img: tplWriter, name: 'Editorial Voice', profession: 'Writers', color: '#8a5a2b', tags: ['Essays', 'Press'] },
	{ img: tplFilm, name: 'Cinematic Reel', profession: 'Filmmakers', color: '#d4af37', tags: ['Reels', 'Stills'] },
	{ img: tplConsultant, name: 'Strategy Deck', profession: 'Consultants', color: '#ff7a00', tags: ['Decks', 'KPIs'] },
	{ img: tplCeo, name: 'Executive Suite', profession: 'CEO', color: '#d4af37', tags: ['Leadership', 'Vision'] },
	{ img: tplCto, name: 'Tech Blueprint', profession: 'CTO', color: '#3b82f6', tags: ['Architecture', 'Scale'] },
	{ img: tplAi, name: 'Neural Canvas', profession: 'AI Architect', color: '#8b5cf6', tags: ['LLMs', 'Systems'] },
	{ img: tplMle, name: 'Model Lab', profession: 'ML Engineer', color: '#ec4899', tags: ['Models', 'Pipelines'] },
	{ img: tplSurgeon, name: 'Clinical Profile', profession: 'Surgeons', color: '#14b8a6', tags: ['Cases', 'Publications'] },
	{ img: tplBanker, name: 'Deal Track', profession: 'Investment Banker', color: '#b8860b', tags: ['AUM', 'Deals'] },
	{ img: tplBlockchain, name: 'Chain Architect', profession: 'Blockchain', color: '#10b981', tags: ['Web3', 'Contracts'] },
	{ img: tplCloud, name: 'Cloud Atlas', profession: 'Cloud Architect', color: '#0ea5e9', tags: ['AWS', 'Azure'] }
];

export interface Profession {
	emoji: string;
	name: string;
}

export const PROFESSIONS: Profession[] = [
	{ emoji: '📣', name: 'Marketers' },
	{ emoji: '🎨', name: 'Product Designers' },
	{ emoji: '🏗', name: 'Architects' },
	{ emoji: '🛋', name: 'Interior Designers' },
	{ emoji: '🎓', name: 'Students' },
	{ emoji: '💻', name: 'Software Engineers' },
	{ emoji: '📊', name: 'Data Scientists' },
	{ emoji: '📸', name: 'Photographers' },
	{ emoji: '🎬', name: 'Filmmakers' },
	{ emoji: '✍️', name: 'Writers' },
	{ emoji: '🎤', name: 'Content Creators' },
	{ emoji: '🎵', name: 'Musicians' },
	{ emoji: '🧑‍🍳', name: 'Chefs' },
	{ emoji: '💼', name: 'Consultants' },
	{ emoji: '📈', name: 'Product Managers' },
	{ emoji: '🧠', name: 'Researchers' },
	{ emoji: '🩺', name: 'Doctors' },
	{ emoji: '⚖️', name: 'Lawyers' },
	{ emoji: '🏫', name: 'Teachers' },
	{ emoji: '🎭', name: 'Actors' },
	{ emoji: '🖌', name: 'Illustrators' },
	{ emoji: '📱', name: 'UX Designers' },
	{ emoji: '🌍', name: 'Founders' },
	{ emoji: '💡', name: 'Engineers' },
	{ emoji: '🎯', name: 'Brand Strategists' },
	{ emoji: '🛠', name: 'Freelancers' },
	{ emoji: '📐', name: 'Industrial Designers' },
	{ emoji: '🧪', name: 'Scientists' },
	{ emoji: '🪙', name: 'Finance Pros' },
	{ emoji: '🚀', name: 'Startup Talent' }
];
