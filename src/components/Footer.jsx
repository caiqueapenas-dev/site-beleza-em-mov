// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube } from 'lucide-react';

// This is the function that defines your component
function Footer() {
    return (
        <footer id="contact" className="bg-gray-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h4 className="text-xl font-bold mb-4">Beleza em Movimento</h4>
                        <p className="text-gray-400">Performance que te move, estilo que te define.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Institucional</h4>
                        <ul className="space-y-2">
                            <li><Link to="/sobre" className="text-gray-400 hover:text-white">Sobre Nós</Link></li>
                            {/* Adicione outras páginas institucionais aqui se precisar */}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Ajuda</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
                            <li><a href="https://api.whatsapp.com/send/?phone=5575983059101" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">Fale Conosco</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Siga-nos</h4>
                        <div className="flex space-x-4">
                            <a href="https://www.instagram.com/belezaemov/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><Instagram /></a>
                            <a href="#" className="text-gray-400 hover:text-white"><Facebook /></a>
                            <a href="#" className="text-gray-400 hover:text-white"><Youtube /></a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; 2025 Beleza em Movimento. Todos os direitos reservados.</p>
                    <p>Beleza em Movimento Comércio de Artigos Esportivos LTDA - CNPJ XX.XXX.XXX/0001-XX</p>
                </div>
            </div>
        </footer>
    );
}

// ✅ This is the essential line that was likely missing.
// It makes the 'Footer' function available for other files to import.
export default Footer;