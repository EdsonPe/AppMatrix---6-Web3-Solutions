// Fix: Add global declaration for Tone.js on the window object to resolve TypeScript errors.
declare global {
    interface Window {
        Tone: any;
    }
}

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from './Button';
import { DragAndDrop } from './DragAndDrop';
import { Modal } from './Modal';
import { Spinner } from './Spinner';
import * as Web3Utils from '../utils/web3';
import { SignatureData } from '../types';

// Wrapper for displaying results
const ResultCard: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div className="mt-6 bg-gray-900/50 border border-gray-700 rounded-lg p-4 animate-fade-in">
        <h3 className="text-lg font-bold text-brand-accent font-mono mb-3">{title}</h3>
        <div className="space-y-2 text-sm break-words">{children}</div>
    </div>
);

// A small component to copy text to clipboard
const CopyToClipboard: React.FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={handleCopy} className="ml-2 p-1 text-gray-400 hover:text-brand-accent transition-colors">
            {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" /><path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h6a2 2 0 00-2-2H5z" /></svg>
            )}
        </button>
    );
};


// 1. Code Attestor
export const CodeAttestor: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [hash, setHash] = useState<string | null>(null);
    const [signatureData, setSignatureData] = useState<SignatureData | null>(null);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        // Fix: Use 'number' for setTimeout return type in browser environments instead of 'NodeJS.Timeout'.
        let timer: number;
        if (isModalOpen && countdown > 0) {
            timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        } else if (isModalOpen && countdown === 0) {
            setIsModalOpen(false);
            setTxHash(Web3Utils.generateFakeTxHash());
            setIsProcessing(false);
        }
        return () => clearTimeout(timer);
    }, [isModalOpen, countdown]);

    const handleFileDrop = useCallback((droppedFile: File) => {
        setFile(droppedFile);
        setHash(null);
        setSignatureData(null);
        setTxHash(null);
    }, []);

    const handleAttest = async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            // Step 1: Calculate Hash
            const fileHash = await Web3Utils.calculateSHA256(file);
            setHash(fileHash);

            // Step 2: Generate Keys & Sign
            const keyPair = await Web3Utils.generateRsaKeyPair();
            const signature = await Web3Utils.signData(keyPair.privateKey, fileHash);
            setSignatureData({ signature, fileName: file.name });
            
            // Step 3: Trigger 2FA modal
            setCountdown(5);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Attestation failed:", error);
            setIsProcessing(false);
        }
    };
    
    const handleDownloadSignature = () => {
        if (!signatureData) return;
        Web3Utils.downloadTextFile(signatureData.signature, `${signatureData.fileName}.sig`);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-4">Code Attestor</h2>
            <p className="text-gray-400 mb-6">Upload a ZIP file to generate its SHA-256 hash, sign it with an RSA-2048 key, and simulate minting an attestation NFT on Polygon Mumbai.</p>
            <DragAndDrop onFileDrop={handleFileDrop} acceptedFileType=".zip">
                <div className="text-gray-400">
                    <p className="font-bold text-lg">Drag & Drop ZIP File Here</p>
                    <p>or click to select a file</p>
                </div>
            </DragAndDrop>
            
            {file && (
                <div className="mt-6 text-center">
                    <Button onClick={handleAttest} isLoading={isProcessing} disabled={!file || isProcessing}>
                        Attest & Sign Code
                    </Button>
                </div>
            )}

            {hash && (
                <ResultCard title="Attestation Details">
                    <p className="font-mono flex items-center"><strong>SHA-256 Hash:</strong><span className="ml-2 text-gray-300 truncate">{hash}</span> <CopyToClipboard text={hash} /></p>
                    {signatureData && <p className="font-mono flex items-center"><strong>Signature:</strong><span className="ml-2 text-gray-300 truncate">{signatureData.signature}</span><CopyToClipboard text={signatureData.signature} /></p>}
                </ResultCard>
            )}

            {txHash && (
                 <ResultCard title="NFT Minted Successfully">
                    <p className="font-mono flex items-center"><strong>Polygon Tx Hash:</strong><span className="ml-2 text-gray-300 truncate">{txHash}</span> <CopyToClipboard text={txHash} /></p>
                    <div className="mt-4">
                        <Button onClick={handleDownloadSignature}>Download .sig File</Button>
                    </div>
                 </ResultCard>
            )}

            <Modal isOpen={isModalOpen}>
                <h3 className="text-xl font-bold text-center text-white">2FA Confirmation Required</h3>
                <p className="text-gray-400 text-center my-4">Simulating two-factor authentication. Minting will proceed automatically.</p>
                <div className="flex justify-center items-center my-6">
                    <div className="w-24 h-24 rounded-full border-4 border-brand-accent flex items-center justify-center text-4xl font-mono text-brand-accent animate-pulse">
                        {countdown}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

// 2. NFT Minter
export const NftMinter: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [metadata, setMetadata] = useState<object | null>(null);
    const [tokenId, setTokenId] = useState<number | null>(null);
    const [isMinting, setIsMinting] = useState(false);

    const handleFileDrop = async (file: File) => {
        setImageFile(file);
        setMetadata(null);
        setTokenId(null);
        const previewUrl = await Web3Utils.fileToBase64(file);
        setImagePreview(previewUrl);
    };

    const handleMint = () => {
        if (!imageFile) return;
        setIsMinting(true);
        // Simulate metadata generation and minting
        const generatedMetadata = {
            name: "Meu NFT",
            description: "A unique digital collectible generated by AppMatrix.",
            image: `ipfs://${Web3Utils.generateFakeCid()}`,
            attributes: [
                { trait_type: "Tool", value: "AppMatrix NFT Minter" },
                { trait_type: "Timestamp", value: Date.now() }
            ]
        };
        setMetadata(generatedMetadata);

        setTimeout(() => {
            setTokenId(Math.floor(Math.random() * 100000));
            setIsMinting(false);
        }, 3000);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-4">NFT Minter</h2>
            <p className="text-gray-400 mb-6">Upload an image to generate metadata and simulate minting an NFT on the blockchain.</p>
            <DragAndDrop onFileDrop={handleFileDrop} acceptedFileType="image/*">
                {imagePreview ? (
                    <img src={imagePreview} alt="NFT Preview" className="max-h-40 mx-auto rounded-lg" />
                ) : (
                    <div className="text-gray-400">
                        <p className="font-bold text-lg">Drag & Drop Image Here</p>
                        <p>or click to select a file</p>
                    </div>
                )}
            </DragAndDrop>

            {imageFile && (
                <div className="mt-6 text-center">
                    <Button onClick={handleMint} isLoading={isMinting} disabled={!imageFile || isMinting}>
                        Mint "Meu NFT"
                    </Button>
                </div>
            )}
            
            {metadata && (
                <ResultCard title="Generated Metadata">
                    <pre className="text-xs bg-black/50 p-2 rounded whitespace-pre-wrap font-mono">{JSON.stringify(metadata, null, 2)}</pre>
                </ResultCard>
            )}

            {tokenId !== null && (
                <ResultCard title="Mint Successful!">
                    <p className="font-mono"><strong>Token ID:</strong> {tokenId}</p>
                    <a href={`https://mumbai.polygonscan.com/tx/${Web3Utils.generateFakeTxHash()}`} target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:underline font-mono">
                        View on PolygonScan (Fake Link)
                    </a>
                </ResultCard>
            )}
        </div>
    );
};

// 3. Quantum Locker
export const QuantumLocker: React.FC = () => {
    const [password, setPassword] = useState('');
    const [seed, setSeed] = useState<string[]>([]);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const generate = () => {
        setPassword(Web3Utils.generateStrongPassword());
        setSeed(Web3Utils.generateSeedPhrase());
        setIsVerified(false);
    };
    
    const simulateBiometrics = () => {
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            setIsVerified(true);
        }, 2500);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-4">Quantum Locker</h2>
            <p className="text-gray-400 mb-6">Generate a post-quantum-ready password and a 12-word seed phrase. Simulates biometric MFA for access.</p>
            
            <div className="text-center">
                <Button onClick={generate}>Generate New Credentials</Button>
            </div>
            
            {password && (
                <ResultCard title="Generated Credentials">
                    <div className="space-y-4">
                        <div>
                            <p className="font-bold text-gray-300">Generated Password:</p>
                            <div className="font-mono bg-black/50 p-3 rounded flex items-center justify-between">
                                <span className="truncate">{password}</span>
                                <CopyToClipboard text={password} />
                            </div>
                        </div>
                        <div>
                            <p className="font-bold text-gray-300">12-Word Seed Phrase Backup:</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 font-mono bg-black/50 p-3 rounded">
                                {seed.map((word, index) => <span key={index} className="text-gray-400">{index + 1}. {word}</span>)}
                            </div>
                        </div>
                    </div>
                </ResultCard>
            )}
            {password && (
                <div className="mt-6 border-t border-gray-800 pt-6">
                    <h3 className="text-lg font-bold text-center text-white">Biometric Authentication</h3>
                    <p className="text-gray-400 text-center mb-4">Click to simulate a face scan to verify your identity.</p>
                    <div className="text-center">
                        <Button onClick={simulateBiometrics} isLoading={isVerifying} disabled={isVerifying || isVerified}>
                            {isVerified ? 'Verified' : 'Simulate Face Scan'}
                        </Button>
                    </div>
                    {isVerified && <p className="text-brand-accent text-center mt-4 font-bold animate-fade-in">Biometric Verification Successful!</p>}
                </div>
            )}
        </div>
    );
};

// 4. IPFS Linker
export const IpfsLinker: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [cid, setCid] = useState<string | null>(null);
    const [isPinning, setIsPinning] = useState(false);
    const [isPinned, setIsPinned] = useState(false);

    const handleFileDrop = (file: File) => {
        setFile(file);
        setCid(Web3Utils.generateFakeCid());
        setIsPinned(false);
    };

    const handlePin = () => {
        setIsPinning(true);
        setTimeout(() => {
            setIsPinning(false);
            setIsPinned(true);
        }, 2000);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-4">IPFS Linker</h2>
            <p className="text-gray-400 mb-6">Upload any file to generate a simulated IPFS CID and "pin" it to the decentralized network.</p>
            
            <DragAndDrop onFileDrop={handleFileDrop} acceptedFileType="*">
                 <div className="text-gray-400">
                    <p className="font-bold text-lg">Drag & Drop Any File Here</p>
                    <p>or click to select a file</p>
                </div>
            </DragAndDrop>

            {cid && (
                <ResultCard title="IPFS Details">
                     <p className="font-mono flex items-center">
                        <strong>Generated CID:</strong>
                        <span className="ml-2 text-gray-300 truncate">{cid}</span> 
                        <CopyToClipboard text={cid} />
                    </p>
                     <div className="mt-4">
                        <Button onClick={handlePin} isLoading={isPinning} disabled={isPinning || isPinned}>
                            {isPinned ? 'Pinned Successfully!' : 'Pin to IPFS'}
                        </Button>
                     </div>
                </ResultCard>
            )}
        </div>
    );
};

// 5. Enclave Pulse
export const EnclavePulse: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const [hash, setHash] = useState('');
    const [timestamp, setTimestamp] = useState('');
    const synthRef = useRef<any>(null);

    const startPulse = useCallback(() => {
        // Initialize Tone.js synth on user interaction
        if (!synthRef.current && window.Tone) {
            synthRef.current = new window.Tone.Synth({
                oscillator: { type: 'sine' },
                envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 }
            }).toDestination();
        }

        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setHash(Web3Utils.generateFakeTxHash());
                    setTimestamp(new Date().toISOString());
                    // Play sound on completion
                    if (synthRef.current) {
                        synthRef.current.triggerAttackRelease("C4", "8n");
                    }
                    return 100;
                }
                // Play sound intermittently
                if (prev % 25 === 0 && synthRef.current) {
                    synthRef.current.triggerAttackRelease("C3", "16n");
                }
                return prev + 1;
            });
        }, 50);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Cleanup Tone.js synth on component unmount
        return () => {
            if (synthRef.current) {
                synthRef.current.dispose();
            }
        };
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-4">Enclave Pulse</h2>
            <p className="text-gray-400 mb-6">Simulate a secure enclave computation. Press "Initiate" to start the process and generate a secure hash and timestamp.</p>
            
            <div className="flex justify-center items-center my-10">
                <div className="relative w-48 h-48 flex justify-center items-center">
                    <div className="absolute inset-0 bg-brand-accent/10 rounded-full animate-pulse"></div>
                    <div className="w-40 h-40 bg-brand-dark rounded-full border-4 border-brand-accent/30 flex justify-center items-center">
                        <span className="text-3xl font-mono text-brand-accent">{progress}%</span>
                    </div>
                </div>
            </div>

            <div className="w-full bg-gray-800 rounded-full h-4 mb-8">
                <div className="bg-brand-accent h-4 rounded-full transition-all duration-150" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="text-center">
                <Button onClick={startPulse}>Initiate Pulse</Button>
            </div>
            
            {progress === 100 && (
                <ResultCard title="Enclave Output">
                    <p className="font-mono"><strong>Generated Hash:</strong> <span className="text-gray-300">{hash}</span></p>
                    <p className="font-mono"><strong>Timestamp:</strong> <span className="text-gray-300">{timestamp}</span></p>
                </ResultCard>
            )}
        </div>
    );
};

// 6. Code Analyzer
export const CodeAnalyzer: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [report, setReport] = useState<{ score: number; risk: string } | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleFileDrop = (file: File) => {
        setFile(file);
        setReport(null);
    };

    const handleAnalyze = () => {
        if (!file) return;
        setIsAnalyzing(true);
        setTimeout(() => {
            const score = Math.floor(Math.random() * 101);
            let risk = 'Low Risk - Secure';
            if (score > 70) risk = 'High Risk - Vulnerable';
            else if (score > 30) risk = 'Medium Risk - Caution Advised';

            setReport({ score, risk });
            setIsAnalyzing(false);
        }, 3000);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-4">Code Analyzer</h2>
            <p className="text-gray-400 mb-6">Upload a source code file to simulate an AI-powered security analysis and receive a risk score.</p>
            
            <DragAndDrop onFileDrop={handleFileDrop} acceptedFileType=".js,.ts,.sol,.py,.rs,.go">
                <div className="text-gray-400">
                    <p className="font-bold text-lg">Drag & Drop Code File Here</p>
                    <p>or click to select a file</p>
                </div>
            </DragAndDrop>

            {file && (
                <div className="mt-6 text-center">
                    <Button onClick={handleAnalyze} isLoading={isAnalyzing} disabled={!file || isAnalyzing}>
                        Analyze Code
                    </Button>
                </div>
            )}
            
            {report && (
                <ResultCard title="AI Analysis Report">
                     <div className="flex items-baseline justify-between">
                        <span className="font-bold">Security Score:</span>
                        <span className={`text-2xl font-mono font-bold ${report.score < 30 ? 'text-brand-secondary' : report.score < 70 ? 'text-yellow-400' : 'text-red-500'}`}>{report.score}/100</span>
                     </div>
                     <div className="flex items-baseline justify-between mt-2">
                        <span className="font-bold">Assessment:</span>
                        <span className="font-mono">{report.risk}</span>
                     </div>
                </ResultCard>
            )}
        </div>
    );
};