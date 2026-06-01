import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ArrowRightCircle,
  Fingerprint,
  LockKeyhole,
  Menu,
  X,
  Zap,
} from 'lucide-react';

const MotionLink = motion(Link);

const navItems = ['Vault', 'Plans', 'Install', 'News', 'Help'];

const fadeUp = (delay) => ({
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
});

const sheetVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    x: '100%',
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

const logoMarkup = (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" overflow="visible" viewBox="0 0 256 256">
    <path d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z" fill="#192837" />
  </svg>
);

function VaultShieldHome() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const mobileNav = useMemo(
    () => navItems.map((item) => ({ label: item, href: `#${item.toLowerCase()}` })),
    [],
  );

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}
    >
      <Helmet>
        <title>VaultShield | Password Manager</title>
        <meta
          name="description"
          content="VaultShield keeps your passwords covered with unbreakable storage, one-tap access, and pro-grade security tools."
        />
      </Helmet>

      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260518_003132_8b7edcb6-c64d-4a52-a9ca-879942e122ad.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(242,242,238,0.9)_0%,rgba(242,242,238,0.66)_34%,rgba(242,242,238,0.28)_58%,rgba(242,242,238,0.1)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(115,66,226,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(25,40,55,0.12),transparent_28%)]" />

      <header className="relative z-10 mx-auto flex w-full max-w-[1280px] items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center">{logoMarkup}</span>
          <span className="sr-only">VaultShield</span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium tracking-[-0.01em] text-[var(--color-text)]/78 transition-opacity hover:opacity-100"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(115,66,226,0.28)] transition-transform duration-200 hover:scale-[1.02]"
          >
            Start For Free
          </Link>
          <Link
            to="/login"
            className="rounded-full bg-[var(--color-login-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--color-text)] transition-transform duration-200 hover:scale-[1.02]"
          >
            Sign In
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(242,242,238,0.72)] text-[var(--color-text)] backdrop-blur md:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-[1280px] items-center px-5 pb-10 pt-[clamp(40px,8vw,72px)] sm:px-8 sm:pb-14">
        <div className="max-w-[560px]">
          <motion.h1
            className="mb-6 font-[var(--font-heading)] text-[clamp(1.65rem,5vw,3rem)] leading-[1.05] tracking-[-0.01em] text-[var(--color-text)]"
            variants={fadeUp(0)}
            initial="hidden"
            animate="visible"
          >
            <Zap className="relative -top-[2px] mr-2 inline-block h-6 w-6 align-middle" />
            Lock Down Your Passwords
            <LockKeyhole className="relative -top-[2px] mx-2 inline-block h-6 w-6 align-middle" />
            with Ironclad Security
            <Fingerprint className="relative -top-[2px] ml-2 inline-block h-6 w-6 align-middle" />
          </motion.h1>

          <motion.p
            className="max-w-[560px] text-[clamp(0.9rem,2.5vw,1.1rem)] leading-[1.65] text-[var(--color-text)]/80"
            variants={fadeUp(0.15)}
            initial="hidden"
            animate="visible"
          >
            Zero stress, total control. VaultShield keeps you covered with unbreakable storage, one-tap access, and pro-grade tools for your non-stop world.
          </motion.p>

          <motion.div
            className="mt-8"
            variants={fadeUp(0.3)}
            initial="hidden"
            animate="visible"
          >
            <MotionLink
              to="/login"
              whileHover={{ scale: 1.04, filter: 'brightness(1.1)' }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex min-w-[210px] items-center justify-between gap-8 rounded-full bg-[var(--color-accent)] px-6 py-[17px] text-[clamp(0.9rem,2vw,1rem)] font-semibold text-white shadow-[0_4px_24px_rgba(115,66,226,0.28)]"
            >
              <span>Get It Free</span>
              <ArrowRightCircle size={20} />
            </MotionLink>
          </motion.div>
        </div>
      </main>

      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close menu backdrop"
              className="fixed inset-0 z-30 cursor-default"
              style={{ background: 'rgba(25,40,55,0.35)', backdropFilter: 'blur(4px)' }}
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.aside
              className="fixed right-0 top-0 z-40 flex h-[100dvh] w-[min(88vw,360px)] flex-col bg-[#CFC8C5] px-5 py-5 shadow-[-12px_0_48px_rgba(25,40,55,0.18)]"
              variants={sheetVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-center justify-between">
                <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center">{logoMarkup}</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(25,40,55,0.08)] text-[var(--color-text)]"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="mt-5 h-px w-full bg-[rgba(25,40,55,0.14)]" />

              <div className="mt-8 flex flex-1 flex-col">
                <div className="space-y-2">
                  {mobileNav.map((item, index) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-2xl px-1 py-3 text-[1.65rem] font-semibold tracking-[-0.03em] text-[var(--color-text)]"
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.18 + index * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {item.label}
                    </motion.a>
                  ))}
                </div>

                <div className="mt-auto space-y-3 pb-2">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(115,66,226,0.28)]"
                  >
                    Start For Free
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center rounded-full bg-[var(--color-login-bg)] px-5 py-3 text-sm font-semibold text-[var(--color-text)]"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default VaultShieldHome;