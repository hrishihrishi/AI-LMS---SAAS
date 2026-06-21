'use client'

import { cn, configureAssistant } from "@/lib/utils"
import { vapi } from "@/lib/vapi.sdk"
import Vapi from "@vapi-ai/web"
import Lottie, { LottieRef, LottieRefCurrentProps } from "lottie-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import soundwaves from "@/constants/soundwaves.json"
import { addToSessionHistory } from "@/lib/actions/companion.actions"

// Represents the lifecycle states of a Vapi voice call
enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED'
}

/**
 * CompanionComponent
 * Renders the interface for real-time voice calls with the AI Companion.
 * Uses the Vapi SDK client to connect, sends transcripts to display, and renders animated Lottie soundwaves.
 */
export const CompanionComponent = ({ companionId, subject, topic, name, userName, userImage, style, voice }: CompanionComponentProps) => {

    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const lottieRef = useRef<LottieRefCurrentProps>(null)
    const [messages, setMessages] = useState<SavedMessage[]>([])

    // Control soundwave Lottie animation playback depending on speech state
    useEffect(() => {
        if (lottieRef) {
            if (isSpeaking) {
                lottieRef.current?.play()
            } else {
                lottieRef.current?.stop()
            }
        }
    }, [isSpeaking])

    // Bind Vapi SDK event handlers on mount, and detach them on unmount
    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE)
        const onCallEnd = async() => {
            setCallStatus(CallStatus.FINISHED)
            // Log this completed session in the database session history
            await addToSessionHistory(companionId)
        }
        
        // Receives transcripts and appends them to message list
        const onMessage = (message: Message) => {
            if(message.type === 'transcript' && message.transcriptType === 'final') {
                const newMessage= { role: message.role, content: message.transcript}
                setMessages((prev) => [newMessage, ...prev])
            }
        }
        const onError = (error: Error) => console.log('Error', error)
        const onSpeechStart = () => setIsSpeaking(true)
        const onSpeechEnd = () => setIsSpeaking(false)

        // Attach event listeners
        vapi.on('call-start', onCallStart)
        vapi.on('call-end', onCallEnd)
        vapi.on('message', onMessage)
        vapi.on('error', onError)
        vapi.on('speech-start', onSpeechStart)
        vapi.on('speech-end', onSpeechEnd)

        // Cleanup listener references when the component unmounts to prevent doubling captions/transcripts
        return () => {
            vapi.off('call-start', onCallStart)
            vapi.off('call-end', onCallEnd)
            vapi.off('message', onMessage)
            vapi.off('error', onError)
            vapi.off('speech-start', onSpeechStart)
            vapi.off('speech-end', onSpeechEnd)
        }
    }, [])

    // Toggles the local microphone muted status on the Vapi client
    const toggleMicrophone = () => {
        const isMuted = vapi.isMuted()
        vapi.setMuted(!isMuted)
        setIsMuted(!isMuted)
    }

    // Connects to a Vapi audio session with custom dynamic assistants
    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING)

        const assistantOverrides = {
            variableValues: { subject, topic, style },
            clientMessages: ["transcript"],
            serverMessages: [],
        }

        // Configure voice template and begin streaming
        // @ts-expect-error
        vapi.start(configureAssistant(voice, style), assistantOverrides)
    }

    // Disconnects from the current active Vapi session
    const handleDisconnect = () => {
        setCallStatus(CallStatus.FINISHED)
        vapi.stop()
    }

    return (
        <div>
            <section className="flex flex-col h-auto">
                <section className="flex gap-8 max-sm:flex-col">
                    
                    {/* Companion Avatar / Soundwave display */}
                    <div className="companion-section" style={{borderColor: "black"}}>
                        <div className="companion-avatar">
                            {/* SVG Icon (displayed when idle) */}
                            <div className={
                                cn('absolute transition-opacity duration-1000',
                                    callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE ? 'opacity-1001' : 'opacity-0',
                                    callStatus === CallStatus.CONNECTING && 'opacity-100 animate-pulse'
                                )
                            }>
                                <Image src={`/icons/coding.svg`} alt={subject} width={150} height={150} className="max-sm:w-fit" />
                            </div>
                            
                            {/* Interactive Lottie animation (displayed during active calls) */}
                            <div className={cn('absolute transition-opacity duration-1000', callStatus === CallStatus.ACTIVE ? 'opacity-100' : 'opacity-0')}>
                                <Lottie
                                    lottieRef={lottieRef}
                                    animationData={soundwaves}
                                    autoPlay={false}
                                    className="companion-lottie"
                                />
                            </div>
                        </div>
                        <p className="font-bold text-2xl">{name}</p>
                    </div>
                    
                    {/* User profile actions & session toggle */}
                    <div className="user-section">
                        <div className="user-avatar">
                            <Image src={userImage} alt={userName} width={130} height={130} className="rounded-lg" />
                            <p className="font-bold text-2xl">{userName}</p>
                        </div>
                        <button className="btn-mic" onClick={toggleMicrophone} disabled={callStatus !== CallStatus.ACTIVE}>
                            <Image src={isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'} alt="mic" width={36} height={36} />
                            <p className="max-sm:hidden">{isMuted ? 'Tap to turn on microphone' : 'Tap to turn off microphone'}</p>
                        </button>
                        <button className={cn('rounded-lg py-2 cursor-pointer transition-colors w-full text-white',
                         callStatus === CallStatus.ACTIVE ? 'bg-red-700' : 'bg-primary',
                         callStatus === CallStatus.CONNECTING && 'animate-pulse'
                        )} onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}>
                            {callStatus === CallStatus.ACTIVE ? 'End Session' :
                            callStatus === CallStatus.CONNECTING ? 'Connecting' : 'Start session'}
                        </button>
                    </div>
                </section>
                
                {/* Scrollable transcript log */}
                <section className="transcript">
                    <div className="transcript-message no-scrollbar">
                        {messages.map((message, index) => {
                        if(message.role === 'assistant') {
                            return (
                                <p key={index} className="max-sm:text-sm">
                                    {
                                        name
                                            .split(' ')[0]
                                            .replace('/[.,]/g, ','')
                                    }: {message.content}
                                </p>
                            )
                        } else {
                           return <p key={index} className="text-primary max-sm:text-sm">
                                {userName}: {message.content} 
                            </p>
                        }
                    })}
                    </div>
                    {/* <div className="transcript-fade"/> */}
                </section>
            </section>
        </div>
    )
}

export default CompanionComponent
