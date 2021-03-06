import Link from 'next/link';

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: '회원가입', href: '/auth/signup' },
    !currentUser && { label: '로그인', href: '/auth/signin' },
    currentUser && { label: '로그아웃', href: '/auth/signout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">마이크로서비스</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};
