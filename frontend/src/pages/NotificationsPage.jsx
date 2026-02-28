import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptFriendRequest,
  getFriendRequests,
  rejectFriendRequest,
  cancelFriendRequest,
  getOutgoingFriendReqs,
} from "../lib/api";
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  UserCheckIcon,
  XCircleIcon,
  CheckIcon,
  AlertCircleIcon,
} from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";
import toast from "react-hot-toast";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { data: outgoingReqsData } = useQuery({
    queryKey: ["outgoingRequests"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: acceptRequestMutation, isPending: accepting } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      toast.success("Friend request accepted!");
    },
    onError: () => toast.error("Failed to accept request"),
  });

  const { mutate: rejectRequestMutation, isPending: rejecting } = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      toast.success("Friend request rejected");
    },
    onError: () => toast.error("Failed to reject request"),
  });

  const { mutate: cancelRequestMutation, isPending: cancelling } = useMutation({
    mutationFn: cancelFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingRequests"] });
      toast.success("Friend request cancelled");
    },
    onError: () => toast.error("Failed to cancel request"),
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];
  const outgoingRequests = outgoingReqsData || [];

  const hasNotifications =
    incomingRequests.length > 0 ||
    acceptedRequests.length > 0 ||
    outgoingRequests?.length > 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-12">
      <div className="container mx-auto max-w-4xl space-y-8">
        {/* HEADER */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Notifications</h1>
          <p className="text-base-content/60">
            Manage your friend requests and connections
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : hasNotifications ? (
          <>
            {/* INCOMING REQUESTS */}
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <UserCheckIcon className="h-6 w-6 text-primary" />
                    </div>
                    <span>Friend Requests</span>
                  </h2>
                  <span className="badge badge-primary text-base px-3 py-2">
                    {incomingRequests.length} New
                  </span>
                </div>

                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="card bg-base-100 border border-base-300 shadow-md hover:shadow-lg transition-all"
                    >
                      <div className="card-body p-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="avatar size-16 border-2 border-primary rounded-full">
                              <img
                                src={request.sender.profilePic}
                                alt={request.sender.fullName}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg hover:text-primary transition-colors">
                                {request.sender.fullName}
                              </h3>
                              {request.sender.location && (
                                <p className="text-xs text-base-content/60">
                                  📍 {request.sender.location}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-1 mt-2">
                                {request.sender.nativeLanguage && (
                                  <span className="badge badge-sm badge-primary">
                                    {request.sender.nativeLanguage}
                                  </span>
                                )}
                                {request.sender.learningLanguage && (
                                  <span className="badge badge-sm badge-secondary">
                                    Learning: {request.sender.learningLanguage}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 w-full sm:w-auto">
                            <button
                              className="btn btn-primary btn-sm flex-1 sm:flex-none gap-1 normal-case"
                              onClick={() => acceptRequestMutation(request._id)}
                              disabled={accepting}
                            >
                              {accepting ? (
                                <span className="loading loading-spinner loading-sm" />
                              ) : (
                                <CheckIcon className="size-4" />
                              )}
                              <span className="hidden sm:inline">Accept</span>
                            </button>
                            <button
                              className="btn btn-error btn-sm flex-1 sm:flex-none gap-1 normal-case"
                              onClick={() => rejectRequestMutation(request._id)}
                              disabled={rejecting}
                            >
                              {rejecting ? (
                                <span className="loading loading-spinner loading-sm" />
                              ) : (
                                <XCircleIcon className="size-4" />
                              )}
                              <span className="hidden sm:inline">Reject</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* PENDING REQUESTS */}
            {outgoingRequests && outgoingRequests.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <div className="p-2 bg-warning/20 rounded-lg">
                      <ClockIcon className="h-6 w-6 text-warning" />
                    </div>
                    <span>Pending Requests</span>
                  </h2>
                  <span className="badge badge-warning text-base px-3 py-2">
                    {outgoingRequests.length} Sent
                  </span>
                </div>

                <div className="space-y-3">
                  {outgoingRequests.map((req) => (
                    <div
                      key={req._id}
                      className="card bg-base-100 border border-base-300 shadow-md hover:shadow-lg transition-all"
                    >
                      <div className="card-body p-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="avatar size-14 border-2 border-warning rounded-full">
                              <img
                                src={req.recipient.profilePic}
                                alt={req.recipient.fullName}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold">{req.recipient.fullName}</h3>
                              <p className="text-xs text-base-content/60 flex items-center gap-1">
                                <ClockIcon className="size-3" />
                                Request pending
                              </p>
                            </div>
                          </div>

                          <button
                            className="btn btn-outline btn-error btn-sm gap-1 w-full sm:w-auto normal-case"
                            onClick={() => cancelRequestMutation(req._id)}
                            disabled={cancelling}
                          >
                            {cancelling ? (
                              <span className="loading loading-spinner loading-sm" />
                            ) : (
                              <XCircleIcon className="size-4" />
                            )}
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ACCEPTED REQUESTS */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <div className="p-2 bg-success/20 rounded-lg">
                      <BellIcon className="h-6 w-6 text-success" />
                    </div>
                    <span>New Connections</span>
                  </h2>
                  <span className="badge badge-success text-base px-3 py-2">
                    {acceptedRequests.length} Connected
                  </span>
                </div>

                <div className="space-y-3">
                  {acceptedRequests.map((notification) => (
                    <div
                      key={notification._id}
                      className="card bg-gradient-to-r from-success/10 to-primary/10 border border-success/30 shadow-md hover:shadow-lg transition-all"
                    >
                      <div className="card-body p-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="avatar size-14 border-2 border-success rounded-full">
                              <img
                                src={notification.recipient.profilePic}
                                alt={notification.recipient.fullName}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold">{notification.recipient.fullName}</h3>
                              <p className="text-xs text-base-content/60">
                                Accepted your friend request
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 w-full sm:w-auto">
                            <span className="badge badge-success gap-1">
                              <CheckIcon className="size-3" />
                              <span className="hidden sm:inline">Connected</span>
                              <span className="sm:hidden">OK</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <div className="card bg-base-200/50 border border-base-300 p-12 text-center">
            <AlertCircleIcon className="size-16 mx-auto text-base-content/60 mb-4" />
            <h3 className="font-bold text-xl mb-2">All caught up!</h3>
            <p className="text-base-content/70">
              You have no pending notifications. Check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default NotificationsPage;
