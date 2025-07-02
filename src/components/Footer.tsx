import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400">
      <div className="container mx-auto px-4 py-12">
        {/* Grade de Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Coluna de Endereço */}
          <div>
            <h3 className="text-white font-bold uppercase mb-4">Endereço</h3>
            <p className="text-sm">Rua</p>
            <p className="text-sm">Número e Bairro</p>
            <p className="text-sm">Cidade</p>
            <p className="text-sm">Estado</p>
            <p className="text-sm">CEP</p>
          </div>

          {/* Coluna de Telefones */}
          <div>
            <h3 className="text-white font-bold uppercase mb-4">Telefones</h3>
            <p className="text-sm">(xx) xxxx-xxxx</p>
            <p className="text-sm">(yy) yyyy-yyyy</p>
          </div>

          {/* Coluna de E-mails */}
          <div>
            <h3 className="text-white font-bold uppercase mb-4">E-mails</h3>
            <a href="mailto:informacoes@hmrow.com.br" className="block text-sm hover:text-white">
              info@email.com
            </a>
            <a href="mailto:pedidos@hmrow.com.br" className="block text-sm hover:text-white">
              pedido@email.com
            </a>
          </div>

          {/* Coluna Institucional (Exemplo) */}
          <div>
            <h3 className="text-white font-bold uppercase mb-4">Institucional</h3>
            <ul>
              <li>
                <a href="/sobre-nos" className="text-sm hover:text-white">
                  Quem Somos
                </a>
              </li>
              <li>
                <a href="/politica-de-privacidade" className="text-sm hover:text-white">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="/termos-de-uso" className="text-sm hover:text-white">
                  Termos de Uso
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Seção de Pagamentos */}
        <div className="border-t border-gray-800 pt-8">
          <h3 className="text-white font-bold uppercase mb-4 text-center">Pagamentos</h3>
          <div className="flex justify-center items-center space-x-4">
            <span className="text-lg">PIX</span>
            <span className="text-lg">PayPal</span>
            <span className="text-lg">VISA</span>
            <span className="text-lg">MasterCard</span>
            <span className="text-lg">Boleto</span>
          </div>
        </div>
      </div>

      {/* Barra de Copyright */}
      <div className="bg-gray-900 py-4">
        <div className="container mx-auto px-4 text-center text-xs">
          <p>© 2025 - E-Commerce | CNPJ: XX.YYY.XXX/YYYY-XX</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
