import { Helmet } from 'react-helmet-async'

const PageMeta = ({
  title,
  description,
  path = '/',
  image = '/og-default.jpg',
}) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={`https://yourdomain.com${image}`} />
    <link rel="canonical" href={`https://yourdomain.com${path}`} />
  </Helmet>
)

export default PageMeta