interface ReportFooterProps {
  title: string
  slogan: string
  contactPrompt: string
  email: string
  brand: string
}

export function ReportFooter({ title, slogan, contactPrompt, email, brand }: ReportFooterProps) {
  return (
    <footer
      className="flex flex-col justify-end items-center self-stretch overflow-hidden rounded-2xl px-4 py-8 text-center text-white sm:px-8 sm:py-10 lg:p-12"
      style={{
        gap: 0,
        background: '#1E1E1F',
      }}
      role="contentinfo"
    >
      <h2
        className="text-center"
        style={{
          color: '#FFF',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontSize: 24,
          fontStyle: 'normal',
          fontWeight: 500,
          lineHeight: '32px',
        }}
      >
        {title}
      </h2>
      <p
        className="text-center"
        style={{
          color: 'rgba(255, 255, 255, 0.50)',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontSize: 16,
          fontStyle: 'normal',
          fontWeight: 300,
          lineHeight: '24px',
          marginTop: 0,
        }}
      >
        {slogan}
      </p>
      <p
        className="text-center"
        style={{
          color: 'rgba(255, 255, 255, 0.50)',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontSize: 14,
          fontStyle: 'normal',
          fontWeight: 300,
          lineHeight: '24px',
          marginTop: 12,
        }}
      >
        {contactPrompt}
      </p>
      <a
        href={`mailto:${email}`}
        className="text-center hover:underline"
        style={{
          color: '#FFF',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontSize: 14,
          fontStyle: 'normal',
          fontWeight: 700,
          lineHeight: '24px',
          marginTop: 0,
        }}
      >
        {email}
      </a>
      <p
        className="pt-8 text-3xl font-bold tracking-tight text-white sm:text-4xl sm:pt-10 md:text-5xl"
        style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
        aria-label="Marca Ybera"
      >
        {brand}
      </p>
    </footer>
  )
}
