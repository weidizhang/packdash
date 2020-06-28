import React, { Component } from "react";

import "./assets/main.css";

import SavedCard from "./components/SavedCard";
import SearchBar from "./components/SearchBar";
import PackageCard from "./components/PackageCard";
import RowContainer from "./components/RowContainer";

class App extends Component
{
    render()
    {
        return (
            <div>
                <div className="py-3 text-center">
                    <h1 id="logo-text">packdash</h1>
                </div>

                <RowContainer>
                    <SearchBar />
                </RowContainer>

                <div className="gap-space" />

                <RowContainer>
                    <PackageCard />
                </RowContainer>

                <RowContainer>
                    <SavedCard />
                </RowContainer>
            </div>
        );
    }
}

export default App;
