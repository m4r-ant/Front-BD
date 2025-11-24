'use client'

import { useState } from 'react'
import Header from '@/components/header'
import Sidebar from '@/components/sidebar'
import MobileNav from '@/components/mobile-nav'
import FlightsList from '@/components/flights-list'
import ReservationForm from '@/components/reservation-form'
import MyReservations from '@/components/my-reservations'
import LuggageInfo from '@/components/luggage-info'
import CheckIn from '@/components/check-in'

export default function Home() {
  const [currentPage, setCurrentPage] = useState('flights')

  const renderPage = () => {
    switch (currentPage) {
      case 'flights':
        return <FlightsList />
      case 'reservation':
        return <ReservationForm />
      case 'my-reservations':
        return <MyReservations />
      case 'luggage':
        return <LuggageInfo />
      case 'checkin':
        return <CheckIn />
      default:
        return <FlightsList />
    }
  }

  return (
    <div className="flex h-screen bg-background flex-col md:flex-row">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          <div className="container mx-auto px-4 sm:px-6 py-8 max-w-6xl">
            {renderPage()}
          </div>
        </main>
      </div>

      <MobileNav currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  )
}
