// Iconos pixel de 8×8, dibujados para el portafolio. Se escalan en múltiplos
// enteros (16, 24 o 32 px) para que nunca se vean borrosos.
const ICONS = {
  cursor: ['#.......', '##......', '###.....', '####....', '###.....', '##......', '#.......', '........'],
  left: ['...#....', '..##....', '.###....', '####....', '.###....', '..##....', '...#....', '........'],
  right: ['#.......', '##......', '###.....', '####....', '###.....', '##......', '#.......', '........'],
  projects: ['#######.', '#.....#.', '#.###.#.', '#.###.#.', '#.....#.', '#######.', '.#.#.#..', '........'],
  about: ['..###...', '..###...', '...#....', '.#####..', '#.###.#.', '..###...', '..#.#...', '..#.#...'],
  skills: ['..###...', '.#...#..', '#######.', '#.....#.', '#.###.#.', '#.....#.', '#######.', '........'],
  missions: ['##.###..', '#.#...#.', '#.#.#.#.', '#.#...#.', '#.#.#.#.', '#.#...#.', '##.###..', '........'],
  badges: ['#.....#.', '.#...#..', '..#.#...', '..###...', '.#####..', '.##.##..', '.#####..', '..###...'],
  contact: ['........', '#######.', '##...##.', '#.#.#.#.', '#..#..#.', '#.....#.', '#######.', '........'],
  star: ['...#....', '...#....', '#######.', '.#####..', '..###...', '.##.##..', '#.....#.', '........'],
  check: ['........', '......#.', '.....##.', '#...##..', '##.##...', '.###....', '..#.....', '........'],
  lock: ['..###...', '.#...#..', '.#...#..', '#######.', '###.###.', '###.###.', '#######.', '........'],
  ai: ['.#####..', '#.....#.', '#.#.#.#.', '#.....#.', '#.###.#.', '.#####..', '..#.#...', '.##.##..'],
  city: ['....#...', '...###..', '#..###..', '##.###.#', '##.###.#', '##.#.#.#', '########', '........'],
  systems: ['..#.#...', '.#####..', '##...##.', '.#.#.#..', '##...##.', '.#####..', '..#.#...', '........'],
} as const

export type IconName = keyof typeof ICONS

const paths = Object.fromEntries(
  Object.entries(ICONS).map(([name, rows]) => {
    let d = ''
    rows.forEach((row, y) => {
      // Une los píxeles contiguos de cada fila en un solo rectángulo.
      for (let x = 0; x < row.length; x++) {
        if (row[x] !== '#') continue
        let w = 1
        while (row[x + w] === '#') w++
        d += `M${x} ${y}h${w}v1h-${w}z`
        x += w - 1
      }
    })
    return [name, d]
  }),
) as Record<IconName, string>

type Props = {
  name: IconName
  /** sm = 8px (escala 1), md = 16px (escala 2). Ambos crecen en múltiplos enteros con la pantalla. */
  size?: 'sm' | 'md'
  className?: string
  label?: string
}

export function PixelIcon({ name, size = 'md', className = '', label }: Props) {
  return (
    <svg
      viewBox="0 0 8 8"
      shapeRendering="crispEdges"
      className={`px-icon px-icon--${size} ${className}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <path fill="currentColor" d={paths[name]} />
    </svg>
  )
}
