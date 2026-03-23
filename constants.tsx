
import React from 'react';
import { AppType } from './types';
import { CodeAttestor, NftMinter, QuantumLocker, IpfsLinker, EnclavePulse, CodeAnalyzer } from './components/AppModules';

// Simple SVG Icons
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const NftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a2 2 0 00-2 2v12a2 2 0 002 2h0a2 2 0 002-2V4a2 2 0 00-2-2h0zM5 4a2 2 0 00-2 2v8a2 2 0 002 2h0a2 2 0 002-2V6a2 2 0 00-2-2h0zM15 6a2 2 0 00-2 2v4a2 2 0 002 2h0a2 2 0 002-2V8a2 2 0 00-2-2h0z" /></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v2H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2V6a4 4 0 00-4-4zm-2 4V6a2 2 0 114 0v2H8z" clipRule="evenodd" /></svg>;
const CloudIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a4 4 0 10-2.93 7.07A5.99 5.99 0 0012 20H7a5 5 0 01-4.9-5.22A5.98 5.98 0 016 4a5.02 5.02 0 015 5c0 .35-.04.68-.1 1H15z" /></svg>;
const PulseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v2.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L9 6.586V4a1 1 0 011-1zM10 17a7 7 0 110-14 7 7 0 010 14z" clipRule="evenodd" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;

export const MENU_ITEMS = [
    { id: AppType.CodeAttestor, label: 'Code Attestor', icon: <ShieldIcon /> },
    { id: AppType.NftMinter, label: 'NFT Minter', icon: <NftIcon /> },
    { id: AppType.QuantumLocker, label: 'Quantum Locker', icon: <LockIcon /> },
    { id: AppType.IpfsLinker, label: 'IPFS Linker', icon: <CloudIcon /> },
    { id: AppType.EnclavePulse, label: 'Enclave Pulse', icon: <PulseIcon /> },
    { id: AppType.CodeAnalyzer, label: 'Code Analyzer', icon: <SearchIcon /> },
];

export const APP_MODULES: Record<AppType, React.FC> = {
    [AppType.CodeAttestor]: CodeAttestor,
    [AppType.NftMinter]: NftMinter,
    [AppType.QuantumLocker]: QuantumLocker,
    [AppType.IpfsLinker]: IpfsLinker,
    [AppType.EnclavePulse]: EnclavePulse,
    [AppType.CodeAnalyzer]: CodeAnalyzer,
};

export const BIP39_WORDLIST = [
    "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract",
    "acid", "acoustic", "acquire", "across", "act", "action", "actor", "actress",
    "apple", "approve", "april", "arch", "arctic", "area", "arena", "argue",
    "basket", "battle", "beach", "bean", "beauty", "because", "become", "beef",
    "cabin", "cable", "cactus", "cage", "cake", "call", "calm", "camera",
    "damage", "dance", "danger", "daring", "dark", "dash", "daughter", "dawn",
    "eagle", "earth", "easily", "east", "easy", "echo", "ecology", "economy",
    "fabric", "face", "faculty", "fade", "faint", "faith", "fall", "false",
    "galaxy", "gallery", "game", "gap", "garage", "garbage", "garden", "garlic",
    "habit", "hair", "half", "hammer", "hamster", "hand", "happy", "harbor",
    "ice", "icon", "idea", "identify", "idle", "ignore", "ill", "illegal",
    "jacket", "jaguar", "jail", "jam", "jar", "jazz", "jealous", "jeans",
    "keen", "keep", "key", "kick", "kid", "kidney", "kind", "kingdom",
    "label", "labor", "ladder", "lady", "lake", "lamp", "language", "laptop",
    "machine", "mad", "magic", "magnet", "maid", "mail", "main", "major",
    "name", "napkin", "narrow", "nasty", "nation", "nature", "near", "neck",
    "oak", "obey", "object", "oblige", "observe", "obtain", "obvious", "occur",
    "pace", "pack", "paddle", "page", "pair", "palace", "palm", "panda",
    "quantum", "quarter", "queen", "quest", "quick", "quiet", "quit", "quiz",
    "race", "rack", "radar", "radio", "rail", "rain", "raise", "rally",
    "sad", "safe", "sail", "salt", "same", "sample", "sand", "satisfy",
    "table", "tackle", "tag", "tail", "talent", "talk", "tank", "tape",
    "unusual", "up", "update", "upgrade", "uphold", "upon", "upper", "upset",
    "vacant", "vacuum", "vague", "valid", "valley", "valve", "van", "vanish",
    "wagon", "wait", "walk", "wall", "walnut", "want", "warfare", "warm",
    "zero", "zone", "zoo", "zombie", "yard", "year", "yellow", "yesterday"
];
