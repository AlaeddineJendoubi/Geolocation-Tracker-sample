//
//  AaquaLocationManager.m
//  TypescriptReactNativeStarter
//
//  Created by alaeddine jendoubi on 14/05/2021.
//

#import "AaquaLocationManager.h"

#import <CoreLocation/CLError.h>
#import <CoreLocation/CLLocationManager.h>
#import <CoreLocation/CLLocationManagerDelegate.h>

#import <React/RCTAssert.h>
#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTLog.h>

typedef NS_ENUM(NSInteger, RNCPositionErrorCode) {
  RNCPositionErrorDenied = 1,
  RNCPositionErrorUnavailable,
  RNCPositionErrorTimeout,
};

typedef NS_ENUM(NSInteger, RNCGeolocationAuthorizationLevel) {
  RNCGeolocationAuthorizationLevelDefault,
  RNCGeolocationAuthorizationLevelWhenInUse,
  RNCGeolocationAuthorizationLevelAlways,
};

#define RNC_DEFAULT_LOCATION_ACCURACY kCLLocationAccuracyHundredMeters

typedef struct {
  BOOL skipPermissionRequests;
  RNCGeolocationAuthorizationLevel authorizationLevel;
} RNCGeolocationConfiguration;

typedef struct {
  double timeout;
  double maximumAge;
  double accuracy;
  double distanceFilter;
  BOOL useSignificantChanges;
} RNCGeolocationOptions;

@implementation RCTConvert (RNCGeolocationAuthorizationLevel)
RCT_ENUM_CONVERTER(RNCGeolocationAuthorizationLevel, (@{
    @"whenInUse": @(RNCGeolocationAuthorizationLevelWhenInUse),
    @"always": @(RNCGeolocationAuthorizationLevelAlways)}),
  RNCGeolocationAuthorizationLevelDefault, integerValue)
@end

@implementation RCTConvert (RNCGeolocationOptions)

+ (RNCGeolocationConfiguration)RNCGeolocationConfiguration:(id)json
{
  NSDictionary<NSString *, id> *options = [RCTConvert NSDictionary:json];

  return (RNCGeolocationConfiguration) {
    .skipPermissionRequests = [RCTConvert BOOL:options[@"skipPermissionRequests"]],
    .authorizationLevel = [RCTConvert RNCGeolocationAuthorizationLevel:options[@"authorizationLevel"]]
  };
}

+ (RNCGeolocationOptions)RNCGeolocationOptions:(id)json
{
  NSDictionary<NSString *, id> *options = [RCTConvert NSDictionary:json];

  double distanceFilter = options[@"distanceFilter"] == NULL ? RNC_DEFAULT_LOCATION_ACCURACY
  : [RCTConvert double:options[@"distanceFilter"]] ?: kCLDistanceFilterNone;

  return (RNCGeolocationOptions){
    .timeout = [RCTConvert NSTimeInterval:options[@"timeout"]] ?: INFINITY,
    .maximumAge = [RCTConvert NSTimeInterval:options[@"maximumAge"]] ?: INFINITY,
    .accuracy = [RCTConvert BOOL:options[@"enableHighAccuracy"]] ? kCLLocationAccuracyBest : RNC_DEFAULT_LOCATION_ACCURACY,
    .distanceFilter = distanceFilter,
    .useSignificantChanges = [RCTConvert BOOL:options[@"useSignificantChanges"]] ?: NO,
  };
}

@end

static NSDictionary<NSString *, id> *RNCPositionError(RNCPositionErrorCode code, NSString *msg /* nil for default */)
{
  if (!msg) {
    switch (code) {
      case RNCPositionErrorDenied:
        msg = @"User denied access to location services.";
        break;
      case RNCPositionErrorUnavailable:
        msg = @"Unable to retrieve location.";
        break;
      case RNCPositionErrorTimeout:
        msg = @"The location request timed out.";
        break;
    }
  }

  return @{
           @"code": @(code),
           @"message": msg,
           @"PERMISSION_DENIED": @(RNCPositionErrorDenied),
           @"POSITION_UNAVAILABLE": @(RNCPositionErrorUnavailable),
           @"TIMEOUT": @(RNCPositionErrorTimeout)
           };
}

@interface RNCGeolocationRequest : NSObject

@property (nonatomic, copy) RCTResponseSenderBlock successBlock;
@property (nonatomic, copy) RCTResponseSenderBlock errorBlock;
@property (nonatomic, assign) RNCGeolocationOptions options;
@property (nonatomic, strong) NSTimer *timeoutTimer;

@end

@implementation RNCGeolocationRequest

- (void)dealloc
{
  if (_timeoutTimer.valid) {
    [_timeoutTimer invalidate];
  }
}

@end

@interface AaqualocationManager () <CLLocationManagerDelegate>

@end

@implementation AaqualocationManager
{
  CLLocationManager *_locationManager;
  NSDictionary<NSString *, id> *_lastLocationEvent;
  NSMutableArray<RNCGeolocationRequest *> *_pendingRequests;
  BOOL _observingLocation;
  BOOL _usingSignificantChanges;
  RNCGeolocationConfiguration _locationConfiguration;
  RNCGeolocationOptions _observerOptions;
}

RCT_EXPORT_MODULE()

#pragma mark - Lifecycle

- (void)dealloc
{
  _usingSignificantChanges ?
  [_locationManager stopMonitoringSignificantLocationChanges] :
  [_locationManager stopUpdatingLocation];

  _locationManager.delegate = nil;
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"geolocationDidChange", @"geolocationError"];
}

#pragma mark - Private API

- (void)beginLocationUpdatesWithDesiredAccuracy:(CLLocationAccuracy)desiredAccuracy distanceFilter:(CLLocationDistance)distanceFilter useSignificantChanges:(BOOL)useSignificantChanges
{
  if (!_locationConfiguration.skipPermissionRequests) {
    [self requestAuthorization];
  }

  if (!_locationManager) {
    _locationManager = [CLLocationManager new];
    _locationManager.delegate = self;
  }

  _locationManager.distanceFilter  = distanceFilter;
  _locationManager.desiredAccuracy = desiredAccuracy;
  _usingSignificantChanges = useSignificantChanges;

  // Start observing location
  _usingSignificantChanges ?
  [_locationManager startMonitoringSignificantLocationChanges] :
  [_locationManager startUpdatingLocation];
}

#pragma mark - Timeout handler

- (void)timeout:(NSTimer *)timer
{
  RNCGeolocationRequest *request = timer.userInfo;
  NSString *message = [NSString stringWithFormat: @"Unable to fetch location within %.1fs.", request.options.timeout];
  request.errorBlock(@[RNCPositionError(RNCPositionErrorTimeout, message)]);
  [_pendingRequests removeObject:request];

  // Stop updating if no pending requests
  if (_pendingRequests.count == 0 && !_observingLocation) {
    _usingSignificantChanges ?
    [_locationManager stopMonitoringSignificantLocationChanges] :
    [_locationManager stopUpdatingLocation];
  }
}

#pragma mark - Public API

RCT_EXPORT_METHOD(setConfiguration:(RNCGeolocationConfiguration)config)
{
  _locationConfiguration = config;
}

RCT_EXPORT_METHOD(requestAuthorization)
{
  if (!_locationManager) {
    _locationManager = [CLLocationManager new];
    _locationManager.delegate = self;
  }
  BOOL wantsAlways = NO;
  BOOL wantsWhenInUse = NO;
  if (_locationConfiguration.authorizationLevel == RNCGeolocationAuthorizationLevelDefault) {
    if ([[NSBundle mainBundle] objectForInfoDictionaryKey:@"NSLocationAlwaysUsageDescription"] &&
        [_locationManager respondsToSelector:@selector(requestAlwaysAuthorization)]) {
      wantsAlways = YES;
    } else if ([[NSBundle mainBundle] objectForInfoDictionaryKey:@"NSLocationWhenInUseUsageDescription"] &&
               [_locationManager respondsToSelector:@selector(requestWhenInUseAuthorization)]) {
      wantsWhenInUse = YES;
    }
  } else if (_locationConfiguration.authorizationLevel == RNCGeolocationAuthorizationLevelAlways) {
    wantsAlways = YES;
  } else if (_locationConfiguration.authorizationLevel == RNCGeolocationAuthorizationLevelWhenInUse) {
    wantsWhenInUse = YES;
  }

  // Request location access permission
  if (wantsAlways) {
    [_locationManager requestAlwaysAuthorization];

    // On iOS 9+ we also need to enable background updates
    NSArray *backgroundModes  = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"UIBackgroundModes"];
    if (backgroundModes && [backgroundModes containsObject:@"location"]) {
      if ([_locationManager respondsToSelector:@selector(setAllowsBackgroundLocationUpdates:)]) {
        [_locationManager setAllowsBackgroundLocationUpdates:YES];
      }
    }
  } else if (wantsWhenInUse) {
    [_locationManager requestWhenInUseAuthorization];
  }
}

RCT_EXPORT_METHOD(startObserving:(RNCGeolocationOptions)options)
{

  // Select best options
  _observerOptions = options;
  for (RNCGeolocationRequest *request in _pendingRequests) {
    _observerOptions.accuracy = MIN(_observerOptions.accuracy, request.options.accuracy);
  }

  [self beginLocationUpdatesWithDesiredAccuracy:_observerOptions.accuracy
                                 distanceFilter:_observerOptions.distanceFilter
                          useSignificantChanges:_observerOptions.useSignificantChanges];
  _observingLocation = YES;
}

RCT_EXPORT_METHOD(stopObserving)
{
  // Stop observing
  _observingLocation = NO;

  // Stop updating if no pending requests
  if (_pendingRequests.count == 0) {
    _usingSignificantChanges ?
    [_locationManager stopMonitoringSignificantLocationChanges] :
    [_locationManager stopUpdatingLocation];
  }
}


#pragma mark - CLLocationManagerDelegate

- (void)locationManager:(CLLocationManager *)manager
     didUpdateLocations:(NSArray<CLLocation *> *)locations
{
  // Create event
  CLLocation *location = locations.lastObject;
  _lastLocationEvent = @{
                             @"latitude": @(location.coordinate.latitude),
                             @"longitude": @(location.coordinate.longitude),
                         };

  // Send event
  if (_observingLocation) {
    [self sendEventWithName:@"geolocationDidChange" body:_lastLocationEvent];
  }

  // Fire all queued callbacks
  for (RNCGeolocationRequest *request in _pendingRequests) {
    request.successBlock(@[_lastLocationEvent]);
    [request.timeoutTimer invalidate];
  }
  [_pendingRequests removeAllObjects];

  // Stop updating if not observing
  if (!_observingLocation) {
    _usingSignificantChanges ?
    [_locationManager stopMonitoringSignificantLocationChanges] :
    [_locationManager stopUpdatingLocation];
  }

}


@end
