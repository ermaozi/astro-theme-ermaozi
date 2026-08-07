const modules = import.meta.glob<{ default: any }>('../components/slots/*.{astro,vue}', { eager: true })

export function userSlotComponent(name: string) {
  const pascalName = name.split('-').map(part => part[0]?.toUpperCase() + part.slice(1)).join('')
  return modules[`../components/slots/${name}.astro`]?.default
    ?? modules[`../components/slots/${name}.vue`]?.default
    ?? modules[`../components/slots/${pascalName}.astro`]?.default
    ?? modules[`../components/slots/${pascalName}.vue`]?.default
}

export const hasUserSlot = (name: string) => Boolean(userSlotComponent(name))
