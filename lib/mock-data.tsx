import type { User } from "./auth-context"

export interface Post {
  id: string
  author: User
  content: string
  image?: string
  likes: number
  comments: Comment[]
  createdAt: Date
  likedBy: string[]
}

export interface Comment {
  id: string
  author: User
  content: string
  createdAt: Date
}

// Mock users
export const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "marie.dupont@est.com",
    name: "Marie Dupont",
    role: "student",
    avatar: "/diverse-female-student.png",
    bio: "Étudiante en génie informatique - Passionnée par le développement web",
    followers: 124,
    following: 89,
  },
  {
    id: "2",
    email: "prof.ahmed@est.com",
    name: "Ahmed Bennani",
    role: "teacher",
    avatar: "/male-professor.png",
    bio: "Professeur de mathématiques et algorithmique",
    followers: 456,
    following: 32,
  },
  {
    id: "3",
    email: "sara.alami@est.com",
    name: "Sara Alami",
    role: "student",
    avatar: "/female-student-with-hijab.jpg",
    bio: "Étudiante en génie civil - Membre du club robotique",
    followers: 98,
    following: 156,
  },
  {
    id: "4",
    email: "prof.laila@est.com",
    name: "Laila Zahiri",
    role: "teacher",
    avatar: "/female-professor.png",
    bio: "Professeure de physique et sciences des matériaux",
    followers: 342,
    following: 45,
  },
  {
    id: "5",
    email: "youssef.tazi@est.com",
    name: "Youssef Tazi",
    role: "student",
    avatar: "/male-student-smiling.jpg",
    bio: "Étudiant en génie électrique - Passionné d'électronique",
    followers: 167,
    following: 203,
  },
]

// Mock posts
export const MOCK_POSTS: Post[] = [
  {
    id: "1",
    author: MOCK_USERS[0],
    content:
      "Excellent séminaire sur l'intelligence artificielle aujourd'hui ! Merci au professeur Bennani pour cette présentation inspirante. 🤖",
    image: "/ai-presentation-classroom.jpg",
    likes: 45,
    likedBy: ["2", "3", "4"],
    comments: [
      {
        id: "c1",
        author: MOCK_USERS[1],
        content: "Merci Marie ! Ravi que cela vous ait plu.",
        createdAt: new Date("2024-01-15T14:30:00"),
      },
      {
        id: "c2",
        author: MOCK_USERS[2],
        content: "J'ai adoré aussi ! Très instructif.",
        createdAt: new Date("2024-01-15T15:00:00"),
      },
    ],
    createdAt: new Date("2024-01-15T13:45:00"),
  },
  {
    id: "2",
    author: MOCK_USERS[1],
    content:
      "Rappel : le devoir de mathématiques est à rendre avant vendredi. N'hésitez pas à me contacter pour toute question !",
    likes: 23,
    likedBy: ["1", "3", "5"],
    comments: [],
    createdAt: new Date("2024-01-15T10:20:00"),
  },
  {
    id: "3",
    author: MOCK_USERS[2],
    content: "Notre projet de fin d'année avance bien ! Fière de mon équipe. Voici une photo de notre prototype. 💪",
    image: "/engineering-robotics-project.jpg",
    likes: 67,
    likedBy: ["1", "2", "4", "5"],
    comments: [
      {
        id: "c3",
        author: MOCK_USERS[4],
        content: "Super travail ! Continuez comme ça.",
        createdAt: new Date("2024-01-14T16:45:00"),
      },
    ],
    createdAt: new Date("2024-01-14T16:15:00"),
  },
  {
    id: "4",
    author: MOCK_USERS[3],
    content:
      "Nouvelle expérience de laboratoire disponible pour les étudiants de deuxième année. Inscriptions ouvertes au bureau 204.",
    likes: 34,
    likedBy: ["1", "2", "5"],
    comments: [],
    createdAt: new Date("2024-01-14T09:00:00"),
  },
  {
    id: "5",
    author: MOCK_USERS[4],
    content:
      "Quelqu'un pour un café à la cafétéria après les cours ? On pourrait discuter du projet de circuits électroniques.",
    likes: 18,
    likedBy: ["1", "3"],
    comments: [
      {
        id: "c4",
        author: MOCK_USERS[0],
        content: "Je suis partante ! À 16h ?",
        createdAt: new Date("2024-01-13T14:20:00"),
      },
      {
        id: "c5",
        author: MOCK_USERS[4],
        content: "Parfait ! À tout à l'heure.",
        createdAt: new Date("2024-01-13T14:25:00"),
      },
    ],
    createdAt: new Date("2024-01-13T14:10:00"),
  },
]
