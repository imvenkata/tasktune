import {
  ShowerHeadIcon as Shower,
  Briefcase,
  Box,
  Phone,
  Laptop,
  Camera,
  Book,
  Gift,
  Coffee,
  Cake,
  Shirt,
  PenIcon as Pants,
  User,
  Users,
  Baby,
  Plane,
  Train,
  Bus,
  Bike,
  Ship,
  CarTaxiFrontIcon as Taxi,
  TreesIcon as Tree,
  Flower,
  Sun,
  Moon,
  Cloud,
  CloudRainIcon as Rain,
  Mountain,
  Star,
  Music,
  Circle,
  Square,
} from "lucide-react"

const ShowerHeadIcon = Shower
const PenIcon = Pants
const CarTaxiFrontIcon = Taxi
const TreesIcon = Tree
const CloudRainIcon = Rain

export const ICON_COLLECTION = {
  shower: ShowerHeadIcon,
  briefcase: Briefcase,
  box: Box,
  phone: Phone,
  laptop: Laptop,
  camera: Camera,
  book: Book,
  gift: Gift,
  coffee: Coffee,
  cake: Cake,
  shirt: Shirt,
  pants: PenIcon,
  user: User,
  users: Users,
  baby: Baby,
  plane: Plane,
  train: Train,
  bus: Bus,
  bike: Bike,
  ship: Ship,
  taxi: CarTaxiFrontIcon,
  tree: TreesIcon,
  flower: Flower,
  sun: Sun,
  moon: Moon,
  cloud: Cloud,
  rain: CloudRainIcon,
  mountain: Mountain,
  star: Star,
  music: Music,
  circle: Circle,
  square: Square,
  lightning: LightningIcon,
  computer: ComputerIcon,
  heart: HeartIcon,
  smile: SmileIcon,
}

function HeartIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3.5c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5L12 22l7-8Z" />
    </svg>
  )
}

function LightningIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="13 3 13 11 21 3 12 21 12 13 3 21" />
    </svg>
  )
}

function ComputerIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}

function SmileIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <circle cx="9" cy="9" r="1.5" />
      <circle cx="15" cy="9" r="1.5" />
    </svg>
  )
}

