import Lottie from "react-lottie-player";
import { createPortal } from "react-dom";

export default function Loading() {
   return createPortal(
      <div className="modal-loading-container">
         <div className="modal-loading-content">
            <Lottie
               src="/lotties/loading-driver.json" 
               style={{ background: "transparent", height: "100%" }}
               loop
               play
            />
         </div>
      </div>,
      document.body
   );
}
