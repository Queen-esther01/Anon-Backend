import { ObjectId } from "bson";

export interface AccountInterface {
    createdAt: Date
    username: string
    password: string
    uniqueId: string
    theme: 'pinkgradient' | 'purplegradient'
    generateAuthToken: () => void
    isPublic: boolean
    messagesId: ObjectId
    messageCount: number
    deviceToken: string | null
}

export interface MessageInterface {
    userId: ObjectId
    messages: {
        date: Date
        message: string
    }[]
}

export interface MessageAdditionInterface {
    messagesId: ObjectId
    userId: ObjectId
    message: string
}

export interface SettingsInterface {
    userId: ObjectId
    status: boolean
    theme: string
}