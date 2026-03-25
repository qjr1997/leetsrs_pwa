import { useState } from 'react';
import { FaHeart, FaGithub, FaQrcode } from 'react-icons/fa6';
import { FaTimes } from 'react-icons/fa';
import { bounceButton } from '../../shared/styles';

// 收款码图片路径（相对于部署根目录）
const WECHAT_QR_URL = '/leetsrs_pwa/donate/wechat.png';
const ALIPAY_QR_URL = '/leetsrs_pwa/donate/alipay.png';
const GITHUB_SPONSORS_URL = 'https://github.com/sponsors/qjr1997';

export function DonateSection() {
  const [showQR, setShowQR] = useState<'wechat' | 'alipay' | null>(null);

  return (
    <>
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/30">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <FaHeart className="text-pink-500" />
          支持开发
        </h3>
        <p className="text-sm text-secondary mb-4">
          LeetSRS PWA 是开源免费项目。如果你觉得有用，可以请开发者喝杯咖啡 ☕️
        </p>
        
        <div className="space-y-3">
          {/* 微信打赏 */}
          <button
            onClick={() => setShowQR('wechat')}
            className={`w-full flex items-center justify-between p-3 bg-secondary rounded-lg hover:bg-tertiary transition-colors ${bounceButton}`}
          >
            <span className="text-sm flex items-center gap-2">
              <span className="w-5 h-5 bg-green-500 rounded text-white flex items-center justify-center text-xs font-bold">微</span>
              微信支付
            </span>
            <FaQrcode className="text-secondary" />
          </button>

          {/* 支付宝 */}
          <button
            onClick={() => setShowQR('alipay')}
            className={`w-full flex items-center justify-between p-3 bg-secondary rounded-lg hover:bg-tertiary transition-colors ${bounceButton}`}
          >
            <span className="text-sm flex items-center gap-2">
              <span className="w-5 h-5 bg-blue-500 rounded text-white flex items-center justify-center text-xs font-bold">支</span>
              支付宝
            </span>
            <FaQrcode className="text-secondary" />
          </button>

          {/* GitHub Sponsors - 国际通用 */}
          <a
            href={GITHUB_SPONSORS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between p-3 bg-secondary rounded-lg hover:bg-tertiary transition-colors"
          >
            <span className="text-sm flex items-center gap-2">
              <FaGithub />
              GitHub Sponsors
            </span>
            <span className="text-xs text-secondary">国际支持</span>
          </a>
        </div>

        <p className="text-xs text-secondary mt-4 text-center">
          所有捐赠将用于服务器维护和项目持续开发 ❤️
        </p>
      </div>

      {/* 二维码弹窗 */}
      {showQR && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowQR(null)}
        >
          <div 
            className="bg-secondary rounded-lg p-6 max-w-sm w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQR(null)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-tertiary transition-colors"
            >
              <FaTimes className="text-secondary" />
            </button>
            
            <h4 className="text-lg font-semibold mb-4 text-center">
              {showQR === 'wechat' ? '微信扫码打赏' : '支付宝扫码打赏'}
            </h4>
            
            <div className="bg-white p-4 rounded-lg flex items-center justify-center">
              <img
                src={showQR === 'wechat' ? WECHAT_QR_URL : ALIPAY_QR_URL}
                alt={`${showQR} QR Code`}
                className="max-w-[250px] w-full h-auto"
              />
            </div>
            
            <p className="text-sm text-secondary text-center mt-4">
              感谢你的支持！❤️
            </p>
          </div>
        </div>
      )}
    </>
  );
}
