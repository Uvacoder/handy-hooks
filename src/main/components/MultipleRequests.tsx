import React, { useCallback, useMemo, useState } from "react";
import { useAsync } from "react-use";
import { useThrottleRequests } from "../hooks/useThrottleRequests";

type GitHubUser = { name: string; blog?: string };

function timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function useContributors(contributorsUrlToLoad: string) {
    const { throttle, updateThrottle } = useThrottleRequests<GitHubUser>();
    const [progressMessage, setProgressMessage] = useState("");

    useAsync(async () => {
        if (!contributorsUrlToLoad) return;

        setProgressMessage("loading contributors");

        // load contributors from GitHub
        const contributorsResponse = await fetch(contributorsUrlToLoad);
        const contributors: { url: string }[] = await contributorsResponse.json();

        setProgressMessage(`loading ${contributors.length} contributors...`);

        // For each entry in result, retrieve the given user from GitHub
        const requestsToMake = contributors.map(({ url }, index) => async () => {
            try {
                setProgressMessage(
                    `loading ${index} / ${contributors.length}: ${url}...`
                );

                const response = await fetch(url);
                const json: GitHubUser = await response.json();

                // wait for 1 second before completing the request
                // - makes for better demos
                await timeout(1000);

                updateThrottle.requestSucceededWithData(json);
            } catch (error) {
                console.error(`failed to load ${url}`, error);
                updateThrottle.requestFailedWithError(error);
            }
        });

        await updateThrottle.queueRequests(requestsToMake);

        setProgressMessage("");
    }, [contributorsUrlToLoad, updateThrottle, setProgressMessage]);

    return { throttle, progressMessage };
}

function App() {
    // The owner and repo to query; we're going to default
    // to using DefinitelyTyped as an example repo as it
    // is one of the most contributed to repos on GitHub
    const [owner, setOwner] = useState("DefinitelyTyped");
    const [repo, setRepo] = useState("DefinitelyTyped");
    const handleOwnerChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) =>
            setOwner(event.target.value),
        [setOwner]
    );
    const handleRepoChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => setRepo(event.target.value),
        [setRepo]
    );

    const contributorsUrl = `https://api.github.com/repos/${owner}/${repo}/contributors`;

    const [contributorsUrlToLoad, setUrlToLoad] = useState("");
    const { progressMessage, throttle } = useContributors(contributorsUrlToLoad);

    const bloggers = useMemo(
        () => throttle.values.filter((contributor) => contributor.blog),
        [throttle]
    );

    return (
        <div className="App">
            <header className="App-header">
                <h1>Blogging devs</h1>

                <p>
                    Show me the{" "}
                    <a
                        className="App-link"
                        href={contributorsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        contributors for {owner}/{repo}
                    </a>{" "}
          who have blogs.
        </p>

                <div className="App-labelinput">
                    <label htmlFor="owner">GitHub Owner</label>
                    <input
                        id="owner"
                        type="text"
                        value={owner}
                        onChange={handleOwnerChange}
                    />
                    <label htmlFor="repo">GitHub Repo</label>
                    <input
                        id="repo"
                        type="text"
                        value={repo}
                        onChange={handleRepoChange}
                    />
                </div>

                <button
                    className="App-button"
                    onClick={(e) => setUrlToLoad(contributorsUrl)}
                >
                    Load bloggers from GitHub
        </button>

                {progressMessage && (
                    <div className="App-progress">{progressMessage}</div>
                )}

                {throttle.percentageLoaded > 0 && (
                    <>
                        <h3>Behold {bloggers.length} bloggers:</h3>
                        <div className="App-results">
                            {bloggers.map((blogger) => (
                                <div key={blogger.name}>
                                    <div>{blogger.name}</div>
                                    <a
                                        className="App-link"
                                        href={blogger.blog}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {blogger.blog}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {throttle.errors.length > 0 && (
                    <div className="App-results">
                        {throttle.errors.length} requests errored
                    </div>
                )}
            </header>
        </div>
    );
}

export default App;