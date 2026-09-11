import TopHeader from "@/baseComponents/TopHeader";
import { LogoPanelLayoutBuilder } from "./LogoPanelLayoutBuilder"
import Footer from "@/baseComponents/Footer";
import SearchAi from "@/components/ai/SearchAi";

const SearchAiLayout = () => {
  return (
    <div className="nnp-layout-container header-font">
      <TopHeader />
      <div className="nnp-main-container">
        <div className="nnp-main-content" style={{ minHeight: "100vh" }}>
          <LogoPanelLayoutBuilder>
            <div className="h-full w-full page-padding-medium">
              <SearchAi />
            </div>
          </LogoPanelLayoutBuilder>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default SearchAiLayout;
