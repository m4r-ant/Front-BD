'use client'

export default function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">✈</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">AeroManage</h1>
              <p className="text-xs text-muted-foreground">Sistema de Gestión</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">
                {new Date().toLocaleDateString('es-ES', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleTimeString('es-ES', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
