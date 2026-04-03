// Get the base path for component loading
const basePath = window.location.pathname.includes('/pages/') ? '/../..' : '.'

// Load components dynamically
async function loadComponent(selector, componentPath) {
  try {
    // Construct full path based on current location
    const fullPath = basePath + componentPath
    console.log('Loading:', fullPath)
    
    const response = await fetch(fullPath)
    if (!response.ok) {
      throw new Error(`Failed to load ${fullPath} (${response.status})`)
    }
    const html = await response.text()
    const element = document.querySelector(selector)
    if (element) {
      element.innerHTML = html
      console.log('Loaded:', selector)
    }
  } catch (error) {
    console.error('Error loading component:', error)
  }
}

// Load all components when page loads
document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    loadComponent('#header', '/components/header.html'),
    loadComponent('#nav', '/components/nav.html'),
    loadComponent('#banner', '/components/banner.html'),
    loadComponent('#footer', '/components/footer.html')
  ])
  
  // Reinitialize any scripts that might be needed
  setTimeout(() => {
    console.log('Components loaded successfully')
  }, 100)
})
