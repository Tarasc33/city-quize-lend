import './globals.css'

export const metadata = {
  title: 'Майбутнє моєї країни',
  description: 'Сьогодні мужні українці захищають Європу та світ, а завтра їхня завзятість, підкріплена європейськими цінностями та ресурсами, перебудує країну на краще. Не зважаючи на болючі втрати, Україна приречена на Перемогу. Українці здобудуть самостійну соборну державу та стануть одним із визначальних факторів світової геополітики . Україна буде розвиватися як національна, інноваційна, духовно міцна, високоінтелектуальна та освічена, економічно розвинута Держава. Україна має високий туристичний потенціал та стане новим напрямом для мільйонів туристів з усього світу, які будуть із задоволенням відкривати для себе українську культуру та природу.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet"/>
      </head>
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  )
}

