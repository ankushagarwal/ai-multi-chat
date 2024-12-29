export default function V2Chat() {
  return (
    <div
      id="chats-index-0"
      className="@container flex-shrink-0 md:flex-shrink md:min-w-96 snap-center rounded-md min-h-[250px] bg-background-100 w-full h-full"
      tabIndex={-1}
    >
      <div className="w-full h-full rounded-md border border-gray-alpha-400">
        <div className="h-full w-full overflow-hidden rounded-md">
          <div
            className="flex flex-col flex-no-wrap h-full overflow-y-auto overscroll-y-none"
            style={{ overflowAnchor: 'none' }}
          >
            <div className="sticky top-0 z-10 flex-shrink-0 min-w-0 min-h-0 border-b">
              <div className="flex items-center bg-background-200 backdrop-blur shadow-[0_1px_rgba(202,206,214,.3),0_5px_10px_-5px_rgba(0,0,0,.05)] dark:shadow-[0_1px_rgba(255,255,255,0.15)] justify-between py-3 pl-3 pr-2">
                <div className="flex items-center">Model Name</div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="scrolling-touch scrolling-gpu h-full w-full relative overflow-auto overscroll-y-auto">
                <div className="h-full divide-y pb-12">
                  {/* User message */}
                  <div className="px-3 @md:py-4 py-2.5 group transition-opacity message bg-zinc-100 dark:bg-zinc-900">
                    <p>Hello User Message</p>
                  </div>
                  {/* AI message */}
                  <div className="px-3 @md:py-4 py-2.5 group transition-opacity message">
                    <p>Hello AI Message</p>
                  </div>
                  {/* User message */}
                  <div className="px-3 @md:py-4 py-2.5 group transition-opacity message bg-zinc-100 dark:bg-zinc-900">
                    <p>Hello User Message</p>
                  </div>
                  {/* AI message */}
                  <div className="px-3 @md:py-4 py-2.5 group transition-opacity message">
                    <p>Hello AI Message</p>
                  </div>
                  {/* User message */}
                  <div className="px-3 @md:py-4 py-2.5 group transition-opacity message bg-zinc-100 dark:bg-zinc-900">
                    <p>Hello User Message</p>
                  </div>
                  {/* AI message */}
                  <div className="px-3 @md:py-4 py-2.5 group transition-opacity message">
                    <p>Hello AI Message</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
