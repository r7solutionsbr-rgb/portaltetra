
import React from 'react';
import { UserRole } from './types';

export const ROLES: UserRole[] = [
  UserRole.GESTOR,
  UserRole.FINANCEIRO,
  UserRole.AUDITOR,
  UserRole.OPERACIONAL,
  UserRole.COMERCIAL,
];

export type View = 'dashboard' | 'finance' | 'audit' | 'payment-approval' | 'fleet' | 'people' | 'bot' | 'crm';

interface NavItem {
    name: string;
    view: View;
    roles: UserRole[];
    // FIX: Using React.ReactElement instead of JSX.Element for better compatibility in .ts files
    icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
}

// FIX: Replaced JSX syntax with React.createElement to be compatible with a .ts file.
const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" })
    );
};
// FIX: Replaced JSX syntax with React.createElement to be compatible with a .ts file.
const CurrencyDollarIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })
    );
};
// FIX: Replaced JSX syntax with React.createElement to be compatible with a .ts file.
const TruckIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 013.375-3.375h9.75a3.375 3.375 0 013.375 3.375v1.875m-17.25 4.5L5.625 12H9m12.375 6.75L18.375 12H15m-9.75 6.75h9.75" })
    );
};

const ChatBubbleLeftRightIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72-3.72a1.5 1.5 0 01-2.122 0l-3.72-3.72a2.122 2.122 0 00-2.193 1.98v3.72a1.5 1.5 0 01-2.122 0l-3.72-3.72C3.847 14.61 3 13.646 3 12.511v-4.286c0-.97.616-1.813 1.5-2.097m15.75 0a3.375 3.375 0 00-3.375-3.375H6.375a3.375 3.375 0 00-3.375 3.375m15.75 0c0 .414-.029.826-.083 1.229" })
    );
};
const CheckBadgeIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })
    );
};
const CogIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.343 3.94c.09-.542.56-1.008 1.11-1.233 1.25-.522 2.62.28 3.29.948.67.668 1.468 1.12 2.378 1.341.542.09.94.56 1.233 1.11.522 1.25-.28 2.62-.948 3.29-.668.67-1.12 1.468-1.341 2.378-.09.542-.56.94-1.11 1.233-1.25.522-2.62-.28-3.29-.948-.67-.668-1.468-1.12-2.378-1.341-.542-.09-1.008-.56-1.233-1.11-.522-1.25.28-2.62.948-3.29.668-.67 1.12-1.468 1.341-2.378zM12 15a3 3 0 100-6 3 3 0 000 6z" }),
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })
    );
};

const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-2.063M16.5 7.875a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM9 19.128a9.38 9.38 0 01-2.625.372 9.337 9.337 0 01-4.121-2.063M3 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0z" })
    );
};

const BriefcaseIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M20.25 14.15v4.075c0 1.313-.964 2.446-2.25 2.656-1.285.21-2.513-.334-3.375-1.295-1.134-1.261-2.82-1.261-3.954 0-.862.961-2.09 1.505-3.375 1.295A2.72 2.72 0 013.75 18.225V14.15M12 12.375c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125s-1.125.504-1.125 1.125v4.875c0 .621.504 1.125 1.125 1.125z" }),
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0a2.25 2.25 0 00-2.25-2.25h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0l-7.5-4.615A2.25 2.25 0 012.25 6.993V6.75" })
    );
};


export const NAV_ITEMS: NavItem[] = [
  // --- VISÃO CLIENTE ---
  { name: 'Dashboard', view: 'dashboard', roles: [UserRole.GESTOR], icon: HomeIcon },
  { name: 'Central Financeira', view: 'finance', roles: [UserRole.GESTOR, UserRole.FINANCEIRO], icon: CurrencyDollarIcon },
  { name: 'Aprovação de Pagamentos', view: 'payment-approval', roles: [UserRole.GESTOR, UserRole.FINANCEIRO], icon: CheckBadgeIcon },
  { name: 'Auditoria de Entregas', view: 'audit', roles: [UserRole.GESTOR, UserRole.AUDITOR, UserRole.OPERACIONAL], icon: TruckIcon },
  { name: 'Gestão de Frota', view: 'fleet', roles: [UserRole.GESTOR, UserRole.OPERACIONAL], icon: CogIcon },
  { name: 'Gestão de Pessoas', view: 'people', roles: [UserRole.GESTOR], icon: UsersIcon },
  { name: 'Interação BOTZap', view: 'bot', roles: [UserRole.GESTOR, UserRole.OPERACIONAL], icon: ChatBubbleLeftRightIcon },
  // --- VISÃO INTERNA (TRR) ---
  { name: 'Gestão de Clientes', view: 'crm', roles: [UserRole.COMERCIAL], icon: BriefcaseIcon },
];
