# Phase 1 Client-Side Project Specifications

## 1) Project Scope

The project is a React + Vite + Tailwind hotel management and booking platform with a security-focused admin panel.  
It demonstrates client-side architecture using reusable components, React hooks, routing, state management, and validated forms.

## 2) User Roles

- **Admin**
  - Manages users, rooms, offers, and full security settings.
  - Can access security alerts, lockdown controls, and policy configuration.
- **User**
  - Can browse hotels, view offers, complete bookings, and manage profile data.
- **Guest**
  - Can explore public pages and view available hotels/offers without admin privileges.

## 3) Required Programming Tools and Techniques

- **React (Vite setup)** for component-based frontend.
- **Tailwind CSS** for responsive and consistent UI styling.
- **React Router** for page navigation.
- **React Hooks** (`useState`, `useEffect`, `useMemo`) for state and lifecycle logic.
- **Formik + Yup** for form handling and validation in security configuration forms.
- **Local Storage** for client-side persistence of settings.

## 4) Inputs, Outputs, and Preliminary Data

- **Inputs**
  - Security policy fields (password policy, timeout, 2FA, IP whitelist, retention period).
  - User/admin actions (navigation, toggles, filters, form submissions).
- **Outputs**
  - Validated configuration changes.
  - Security overview stats (blocked IPs, active threats, checks).
  - Filtered alerts table with status badges.
- **Preliminary Data**
  - Mock security events and default role definitions.
  - Default admin security configuration stored in local state/localStorage.

## 5) Assumptions

- This phase uses mock frontend data and client-side persistence only.
- Authentication/authorization is represented in UI flow and role rules, not enforced by backend.
- Security alerts are simulated for demonstration and testing.
- Team members can extend the existing pages while preserving naming and routing consistency.
