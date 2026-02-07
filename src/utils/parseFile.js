const apiDomain = import.meta.env.VITE_API_DOMAIN

export const parsePublicFile = (imgURL) => {
    if (!imgURL) return ''
    
    if (imgURL.startsWith('http') || imgURL.startsWith('blob:')) {
        return imgURL
    }

    const cleanPath = imgURL.startsWith('/') ? imgURL.slice(1) : imgURL
    
    return `${apiDomain}${cleanPath}`
}